export interface Folder {
    id: string
    name: string
    subfolders: Folder[]
  }
  
  export interface BookMarkProps {
    initialFolders?: Folder[]
  }
  
  