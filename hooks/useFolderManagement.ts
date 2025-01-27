import { useState, useCallback } from "react"

export interface Folder {
  id: string
  name: string
  subfolders: Folder[]
}

export function useFolderManagement(initialFolders: Folder[]) {
  const [folders, setFolders] = useState<Folder[]>(initialFolders)
  const [selectedFolderId, setSelectedFolderId] = useState<string>("")

  const handleSelect = useCallback((folderId: string) => {
    setSelectedFolderId(folderId)
  }, [])

  const handleAddFolder = useCallback((parentId: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: "New Folder",
      subfolders: [],
    }

    setFolders((prevFolders) => {
      const addFolderRecursively = (folderList: Folder[]): Folder[] => {
        return folderList.map((folder) => {
          if (folder.id === parentId) {
            return { ...folder, subfolders: [...folder.subfolders, newFolder] }
          } else if (folder.subfolders.length > 0) {
            return {
              ...folder,
              subfolders: addFolderRecursively(folder.subfolders),
            }
          }
          return folder
        })
      }

      return addFolderRecursively(prevFolders)
    })
  }, [])

  const handleRename = useCallback((folderId: string, newName: string) => {
    setFolders((prevFolders) => {
      const renameFolderRecursively = (folderList: Folder[]): Folder[] => {
        return folderList.map((folder) => {
          if (folder.id === folderId) {
            return { ...folder, name: newName }
          } else if (folder.subfolders.length > 0) {
            return {
              ...folder,
              subfolders: renameFolderRecursively(folder.subfolders),
            }
          }
          return folder
        })
      }

      return renameFolderRecursively(prevFolders)
    })
  }, [])

  return {
    folders,
    selectedFolderId,
    handleSelect,
    handleAddFolder,
    handleRename,
  }
}

