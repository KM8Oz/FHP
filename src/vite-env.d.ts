/// <reference types="vite/client" />
/// <reference types="unplugin-icons/types/react" />

interface ImportMetaEnv {
    readonly VITE_POCKET_BASE_URL: string
    readonly VITE_POCKET_BASE_REDIRECT_URL: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}