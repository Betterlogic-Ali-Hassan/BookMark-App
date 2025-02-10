import { useEffect } from "react";
import BookMark from "./components/bookMark/BookMark";
import { BookmarkProvider } from "./components/context/BookmarkContext";

const App = () => {
  useEffect(() => {
    const port = chrome.runtime.connect({ name: "popup" });
  
    return () => {
      port.disconnect(); //  This will trigger "OFF" when the popup is closed
    };
  }, []);
  
  return (
    <BookmarkProvider>
        <BookMark />
    </BookmarkProvider>
  );
};

export default App;
