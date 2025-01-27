interface HeaderProps {
  removeBookMark: boolean;
}

const Header: React.FC<HeaderProps> = ({ removeBookMark }) => (
  <div className='py-3 px-4 border-b'>
    <h1 className='font-medium text-[15px] flex items-center gap-2'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        height='24px'
        viewBox='0 -960 960 960'
        width='24px'
        fill='black'
      >
        <path d='m489-460 91-55 91 55-24-104 80-69-105-9-42-98-42 98-105 9 80 69-24 104Zm19 260h224q-7 26-24 42t-44 20L228-85q-33 5-59.5-15.5T138-154L85-591q-4-33 16-59t53-30l46-6v80l-36 5 54 437 290-36Zm-148-80q-33 0-56.5-23.5T280-360v-440q0-33 23.5-56.5T360-880h440q33 0 56.5 23.5T880-800v440q0 33-23.5 56.5T800-280H360Zm0-80h440v-440H360v440Zm220-220ZM218-164Z' />
      </svg>
      {removeBookMark ? "Edit bookmark" : "Bookmark added"}
    </h1>
  </div>
);

export default Header;
