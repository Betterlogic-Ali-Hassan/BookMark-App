const BookMarkInput = ({
  value,
  title,
}: {
  value?: string;
  title?: string;
}) => {
  return (
    <div className='flex flex-col gap-2'>
      <label className='text-sm font-medium mt-6 '>{title}</label>
      <input
        value={value}
        className='flex h-10 w-full rounded border border-input bg-transparent px-3 py-3 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm '
      />
    </div>
  );
};

export default BookMarkInput;
