import puter from "@heyputer/puter.js";
import { STORAGE_PATHS } from "./constants";
import { createHostingSlug, fetchBlobFromUrl, getHostedUrl, getImageExtension, HOSTING_CONFIG_KEY, imageUrlToPngBlob, isHostedUrl } from "./utils";


export const getOrCreateHostingConfig = async (): Promise<HostingConfig | null> => {
    const existing = (await puter.kv.get(HOSTING_CONFIG_KEY)) as HostingConfig | null;

    if (existing?.subdomain) {
        return { subdomain: existing.subdomain };
    }

    const subdomain = createHostingSlug()

    try{
        await puter.fs.mkdir(STORAGE_PATHS.ROOT, { createMissingParents: true })
        const created = await puter.hosting.create(subdomain, STORAGE_PATHS.ROOT)
        const config: HostingConfig = { subdomain: created.subdomain }
        await puter.kv.set(HOSTING_CONFIG_KEY, config)

        return config

    }catch(e){
        console.warn(`Failed to create hosting subdomain: ${e}`)
        return null
    }

}

export const uploadImageToHosting = async ({ hosting, url, projectId, label }: StoreHostedImageParams): Promise<HostedAsset | null> => {
    if(!hosting || !url) return null;
    if(isHostedUrl(url)) return { url }

    try{
        const resolved = label === "rendered" ? await imageUrlToPngBlob(url).then((blob) => blob ? { blob, contentType: 'image/png' }: null)
        : await fetchBlobFromUrl(url)

        if (!resolved) return null

        const contentType = resolved.contentType || resolved.blob.type || '';
        const ext = getImageExtension(contentType, url)
        const relativeDir = `projects/${projectId}`
        const dir = `${STORAGE_PATHS.ROOT}/${relativeDir}`
        const filePath = `${dir}/${label}.${ext}`

        const uploadFile = new File([resolved.blob], `${label}.${ext}`, {
            type: contentType
        })

        await puter.fs.mkdir(dir, { createMissingParents: true })
        await puter.fs.write(filePath, uploadFile)

        const hostedUrl = getHostedUrl(hosting, `${relativeDir}/${label}.${ext}`)
        if (!hostedUrl) {
            console.warn(`Failed to resolve hosted URL for ${filePath}`);
            return null;
        }
        return { url: hostedUrl };
    }catch (e){
        console.warn(`Failed to store hosted image: ${e}`);
        return null
    }
}