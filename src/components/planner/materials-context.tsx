"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

/**
 * Shared upload state for the Setup screen.
 *
 * The dropzone and the foundation form are separate components, but the engine
 * needs both together: a lesson is grounded in an uploaded material, and the
 * upload (`/ingest`) needs the form's subject/board/grade. So the dropzone
 * holds the actual `File` objects here and the form reads them at submit,
 * ingesting each one before it generates.
 */

export interface UploadedMaterial {
  file: File;
  name: string;
}

interface MaterialsContextValue {
  materials: UploadedMaterial[];
  addFiles: (list: FileList | File[]) => void;
  removeFile: (name: string) => void;
  clear: () => void;
}

const MaterialsContext = createContext<MaterialsContextValue | null>(null);

export function MaterialsProvider({ children }: { children: React.ReactNode }) {
  const [materials, setMaterials] = useState<UploadedMaterial[]>([]);

  const addFiles = useCallback((list: FileList | File[]) => {
    const incoming = Array.from(list).map((file) => ({ file, name: file.name }));
    if (incoming.length === 0) return;
    setMaterials((current) => {
      const seen = new Set(current.map((m) => m.name));
      return [...current, ...incoming.filter((m) => !seen.has(m.name))];
    });
  }, []);

  const removeFile = useCallback((name: string) => {
    setMaterials((current) => current.filter((m) => m.name !== name));
  }, []);

  const clear = useCallback(() => setMaterials([]), []);

  const value = useMemo(
    () => ({ materials, addFiles, removeFile, clear }),
    [materials, addFiles, removeFile, clear],
  );

  return (
    <MaterialsContext.Provider value={value}>
      {children}
    </MaterialsContext.Provider>
  );
}

export function useMaterials(): MaterialsContextValue {
  const context = useContext(MaterialsContext);
  if (!context) {
    throw new Error("useMaterials must be used within a MaterialsProvider");
  }
  return context;
}
