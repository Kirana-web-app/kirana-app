"use client";

import { Button } from "@/src/components/UI/Button";
import { RadioButton } from "@/src/components/UI/RadioButton";
import useAuthStore from "@/src/stores/authStore";
import { DeliverySpeed, Review } from "@/src/types/user";
import { addStoreReview } from "@/src/utils/users";
import { useTranslations } from "next-intl";
import { FC, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { serverTimestamp } from "firebase/firestore";

interface GiveReviewProps {
  storeId: string;
  closeEditor: () => void;
}

const GiveReview: FC<GiveReviewProps> = ({ storeId, closeEditor }) => {
  const { userData } = useAuthStore();
  const queryClient = useQueryClient();

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [deliverySpeed, setDeliverySpeed] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const t = useTranslations("StoreProfile");

  const dr = useTranslations("Bazaar");

  // Mutation for adding review
  const addReviewMutation = useMutation({
    mutationFn: (reviewData: {
      userId: string;
      userName: string;
      rating: number;
      comment: string;
      deliverySpeed: DeliverySpeed;
    }) => addStoreReview(storeId, reviewData),
    onMutate: async (newReview) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: [`reviews_${storeId}`] });

      // Snapshot the previous value
      const previousReviews = queryClient.getQueryData([`reviews_${storeId}`]);

      // Optimistically update to the new value
      queryClient.setQueryData([`reviews_${storeId}`], (old: any) => {
        if (!old) return old;
        const optimisticReview = {
          id: `temp-${Date.now()}`,
          userId: newReview.userId,
          userName: newReview.userName,
          rating: newReview.rating,
          comment: newReview.comment,
          deliverySpeed: newReview.deliverySpeed,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        return [...old, optimisticReview];
      });

      // Return a context object with the snapshotted value
      return { previousReviews };
    },
    onSuccess: () => {
      // Reset form and close editor
      setRating(0);
      setComment("");
      setDeliverySpeed(null);
      setIsSubmitting(false);

      // Refetch to get the real data from server
      queryClient.invalidateQueries({
        queryKey: [`reviews_${storeId}`],
        refetchType: "active",
      });

      // Also invalidate store query to update average ratings
      queryClient.invalidateQueries({
        queryKey: [`store_${storeId}`],
        refetchType: "active",
      });

      // Close the review form
      closeEditor();
    },
    onError: (error, newReview, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(
        [`reviews_${storeId}`],
        context?.previousReviews
      );

      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
      setIsSubmitting(false);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: [`reviews_${storeId}`] });
    },
  });

  const deliveryRate = [
    { id: 1, name: dr("quickDelivery"), value: "1" },
    { id: 2, name: dr("fastDelivery"), value: "2" },
    { id: 3, name: dr("averageDelivery"), value: "3" },
    { id: 4, name: dr("slowDelivery"), value: "4" },
    { id: 5, name: dr("slowestDelivery"), value: "5" },
  ];

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userData) return;

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    if (comment.trim() === "") {
      alert("Please write a review");
      return;
    }

    setIsSubmitting(true);

    // Use the mutation directly
    addReviewMutation.mutate({
      userId: userData.id,
      userName: userData.fullName,
      rating,
      comment: comment.trim(),
      deliverySpeed: deliverySpeed as unknown as DeliverySpeed,
    });
  };

  if (isSubmitting || addReviewMutation.isPending) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Submitting review...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="">
          <label
            htmlFor="review-comment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            <span data-translated>{t("leaveReview")}</span>
          </label>
          <textarea
            id="review-comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="resize-none mt-2 block w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder={t("writeReviewPlaceholder")}
          />
        </div>

        <div className="">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span data-translated>{t("rating")}</span>
          </label>
          {/* Star Rating Component */}
          <div className="flex items-center gap-2 text-primary rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                className={`text-3xl transition-colors hover:scale-110 ${
                  star <= rating
                    ? "text-primary"
                    : "text-gray-300 hover:text-primary/60"
                }`}
              >
                {star <= rating ? "★" : "☆"}
              </button>
            ))}
          </div>
        </div>
        <div className="">
          <label
            htmlFor=""
            className="block text-sm font-medium text-gray-700 mb-3"
          >
            <span data-translated>{t("deliverySpeed")}</span>
          </label>
          <div className="space-y-3">
            {deliveryRate.map((rate) => (
              <RadioButton
                key={rate.id}
                id={`delivery-${rate.id}`}
                name="delivery-rate"
                value={rate.value}
                checked={deliverySpeed === rate.value}
                onChange={setDeliverySpeed}
                label={rate.name}
                className=""
              />
            ))}
          </div>
        </div>

        <Button
          type="submit"
          fullWidth
          disabled={
            isSubmitting ||
            addReviewMutation.isPending ||
            rating === 0 ||
            comment.trim() === ""
          }
          className="my-4"
        >
          <span data-translated>
            {isSubmitting || addReviewMutation.isPending
              ? t("submittingReview")
              : t("submitReview")}
          </span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => closeEditor()}
          fullWidth
          disabled={isSubmitting || addReviewMutation.isPending}
        >
          Cancel
        </Button>
      </form>
    </div>
  );
};

export default GiveReview;
