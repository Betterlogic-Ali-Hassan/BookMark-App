import { useState, useCallback } from "react"

export interface FolderItem {
  id: string
  name: string
  subfolders: FolderItem[]
}

export function useFolderStructure(initialFolders: FolderItem[]) {
  const [folders, setFolders] = useState<FolderItem[]>(initialFolders)
  const [selectedFolderId, setSelectedFolderId] = useState<string>("")

  const handleFolderSelect = useCallback((folderId: string) => {
    setSelectedFolderId(folderId)
  }, [])

  const handleFolderAdd = useCallback((parentId: string) => {
    const newFolder: FolderItem = {
      id: Date.now().toString(),
      name: "New Folder",
      subfolders: [],
    }

    setFolders((prevFolders) => {
      const addFolderRecursively = (folderList: FolderItem[]): FolderItem[] => {
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

  const handleFolderRename = useCallback((folderId: string, newName: string) => {
    setFolders((prevFolders) => {
      const renameFolderRecursively = (folderList: FolderItem[]): FolderItem[] => {
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
    handleFolderSelect,
    handleFolderAdd,
    handleFolderRename,
  }
}

