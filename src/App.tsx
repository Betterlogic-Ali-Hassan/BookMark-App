import BookMark from "./components/bookMark/BookMark";
import { BookmarkProvider } from "./components/context/BookmarkContext";

const App = () => {
  return (
    <BookmarkProvider>
      <div className='flex items-center justify-center min-h-screen w-full'>
        <BookMark />
      </div>
    </BookmarkProvider>
  );
};

export default App;
