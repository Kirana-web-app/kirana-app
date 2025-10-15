"use client";

import { FC, useState, useRef } from "react";
import { CiUser } from "react-icons/ci";
import { MdEdit, MdDelete, MdSave, MdCancel } from "react-icons/md";
import { Timestamp } from "firebase/firestore";
import { DeliverySpeed, Review as ReviewType } from "@/src/types/user";
import { deliveryRate } from "@/src/constants/deliverySpeeds";
import { deleteStoreReview, updateStoreReview } from "@/src/utils/users";
import { Button } from "@/src/components/UI/Button";
import { RadioButton } from "@/src/components/UI/RadioButton";
import { useTranslations } from "next-intl";
import useAuthStore from "@/src/stores/authStore";
import { set } from "react-hook-form";
import LoadingSpinner from "@/src/components/UI/LoadingSpinner";

interface ReviewProps {
  review: ReviewType;
  storeId: string;
  onReviewUpdated?: () => void; // Callback to refresh reviews list
}

const Review: FC<ReviewProps> = ({ review, storeId, onReviewUpdated }) => {
  const { user } = useAuthStore();
  const deleteModalRef = useRef<HTMLDialogElement>(null);

  const canEdit = user?.uid === review.userId;

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedComment, setEditedComment] = useState(review.comment);
  const [editedRating, setEditedRating] = useState(review.rating);
  const [editedDeliverySpeed, setEditedDeliverySpeed] = useState(
    review.deliverySpeed || ""
  );

  const t = useTranslations("StoreProfile");
  const dr = useTranslations("Bazaar");

  const deliverySpeedOptions = [
    { id: 1, name: dr("quickDelivery"), value: "1" },
    { id: 2, name: dr("fastDelivery"), value: "2" },
    { id: 3, name: dr("averageDelivery"), value: "3" },
    { id: 4, name: dr("slowDelivery"), value: "4" },
    { id: 5, name: dr("slowestDelivery"), value: "5" },
  ];

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteStoreReview(storeId, review.id);
      deleteModalRef.current?.close();
      onReviewUpdated?.();
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = () => {
    deleteModalRef.current?.showModal();
  };

  const handleCancelDelete = () => {
    deleteModalRef.current?.close();
  };

  const handleSaveEdit = async () => {
    if (!editedComment.trim() || editedRating === 0) {
      alert("Please provide a rating and comment.");
      return;
    }

    setSaving(true);
    try {
      await updateStoreReview(storeId, review.id, {
        comment: editedComment.trim(),
        rating: editedRating,
        deliverySpeed: editedDeliverySpeed as DeliverySpeed,
      });

      setIsEditing(false);
      onReviewUpdated?.();
    } catch (error) {
      console.error("Error updating review:", error);
      alert("Failed to update review. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedComment(review.comment);
    setEditedRating(review.rating);
    setEditedDeliverySpeed(review.deliverySpeed?.deliverySpeed || "");
    setIsEditing(false);
  };

  const formatDate = (timestamp: any) => {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "2-digit",
      });
    }
    return "N/A";
  };

  if (saving) return <LoadingSpinner />;

  if (isDeleting)
    return (
      <div className="text-center text-red-600">
        <LoadingSpinner />
        <p>Deleting review</p>
      </div>
    );

  if (isEditing) {
    return (
      <div className="border-b border-gray-200 py-4">
        <div className="">
          <div className="flex justify-between gap-4 pb-4">
            <div className="flex gap-4 ">
              <div className="flex items-center justify-center text-primary shrink-0 rounded-full bg-primary-light size-10">
                <CiUser className="size-5" />
              </div>
              <div className="flex items-center gap-2 font-medium">
                <p className="font-semibold user-name">{review.userName}</p>
                <span className="text-sm text-gray-500">(Editing)</span>
              </div>
            </div>
            <p className="text-sm opacity-50 shrink-0 date">
              {formatDate(review.createdAt)}
            </p>
          </div>
          <div className="w-full space-y-4">
            {/* Rating Edit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span data-translated>{t("rating")}</span>
              </label>
              <div className="flex items-center gap-2 text-primary">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEditedRating(star)}
                    className={`text-2xl transition-colors hover:scale-110 ${
                      star <= editedRating
                        ? "text-primary"
                        : "text-gray-300 hover:text-primary/60"
                    }`}
                  >
                    {star <= editedRating ? "★" : "☆"}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Speed Edit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span data-translated>{t("deliverySpeed")}</span>
              </label>
              <div className="space-y-2">
                {deliverySpeedOptions.map((option) => (
                  <RadioButton
                    key={option.id}
                    id={`edit-delivery-${option.id}`}
                    name="edit-delivery-speed"
                    value={option.value}
                    checked={editedDeliverySpeed === option.value}
                    onChange={setEditedDeliverySpeed}
                    label={option.name}
                  />
                ))}
              </div>
            </div>

            {/* Comment Edit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span data-translated>{t("leaveReview")}</span>
              </label>
              <textarea
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows={3}
                placeholder={t("writeReviewPlaceholder")}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveEdit}
                disabled={!editedComment.trim() || editedRating === 0}
                className="flex items-center gap-2 "
              >
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelEdit}
                className="flex items-center gap-2"
              >
                <MdCancel className="size-4" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="border-b border-gray-200 py-4 flex justify-between gap-4">
        <div className="flex items-center justify-center text-primary shrink-0 rounded-full bg-primary-light size-10">
          <CiUser className="size-5" />
        </div>
        <div className="w-full">
          <div className="flex items-center gap-2 font-medium">
            <p className="font-semibold user-name">{review.userName}</p>
            <div className="text-primary rating">{review.rating} ★</div>
          </div>
          {review.deliverySpeed && (
            <div>
              {t("deliveryRate")}:{" "}
              <span className="text-primary rating">
                {
                  deliveryRate[
                    review.deliverySpeed as unknown as keyof typeof deliveryRate
                  ]
                }
              </span>
            </div>
          )}
          <p className="text-base pt-2 review-content">{review.comment}</p>

          {canEdit && (
            <div className="flex gap-4 mt-3">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 text-sm rounded-full text-primary transition-colors"
              >
                <MdEdit className="size-4" />
                Edit
              </button>
              <button
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
              >
                <MdDelete className="size-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>
        <p className="text-sm opacity-50 shrink-0 date">
          {formatDate(review.createdAt)}
        </p>
      </div>

      {/* Delete Confirmation Modal */}
      <dialog
        ref={deleteModalRef}
        className="backdrop:bg-black/50 bg-white rounded-lg shadow-xl max-w-lg w-full p-6 border-0 mx-auto mt-60"
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Delete Review
            </h3>
            <button
              onClick={handleCancelDelete}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isDeleting}
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this review?
            </p>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 italic">"{review.comment}"</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <span>Rating: {review.rating} ★</span>
                {review.deliverySpeed && (
                  <span>
                    • Speed:{" "}
                    {
                      deliveryRate[
                        review.deliverySpeed as unknown as keyof typeof deliveryRate
                      ]
                    }
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              This action cannot be undone.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={handleCancelDelete}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Review"}
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Review;
