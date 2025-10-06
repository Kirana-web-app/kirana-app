export default function Toggle({
  onChange,
  checked,
}: {
  onChange?: () => void;
  checked?: boolean;
}) {
  return (
    <div className="group relative inline-flex w-11 shrink-0 rounded-full bg-gray-200 p-0.5 inset-ring inset-ring-gray-900/5 outline-offset-2 outline-primary transition-colors duration-200 ease-in-out has-checked:bg-primary has-focus-visible:outline-2">
      <span className="size-5 rounded-full bg-white shadow-xs ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out group-has-checked:translate-x-5" />
      <input
        name="setting"
        type="checkbox"
        aria-label="Use setting"
        checked={checked}
        onChange={onChange}
        className="absolute inset-0 appearance-none focus:outline-hidden"
      />
    </div>
  );
}
