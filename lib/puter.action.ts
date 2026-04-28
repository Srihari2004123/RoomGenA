import puter from "@heyputer/puter.js";
import {
    getOrCreateHostingConfig,
    uploadImageToHosting,
} from "./puter.hosting";
import { isHostedUrl } from "./utils";
import { PUTER_WORKER_URL } from "./constants";



// ✅ AUTH
export const signIn = async () => await puter.auth.signIn();
export const signOut = () => puter.auth.signOut();

export const getCurrentUser = async () => {
    try {
        return await puter.auth.getUser();
    } catch {
        return null;
    }
};



// ✅ CREATE PROJECT
export const createProject = async ({
                                        item,
                                        visibility = "private",
                                    }: CreateProjectParams): Promise<DesignItem | null> => {
    if (!PUTER_WORKER_URL) {
        console.warn("❌ Missing VITE_PUTER_WORKER_URL");
        return null;
    }

    try {
        const projectId = item.id;

        console.log("📦 Creating project:", projectId);

        const hosting = await getOrCreateHostingConfig();

        // 🔹 Upload source image
        const hostedSource = projectId
            ? await uploadImageToHosting({
                hosting,
                url: item.sourceImage,
                projectId,
                label: "source",
            })
            : null;

        // 🔹 Upload rendered image
        const hostedRender =
            projectId && item.renderedImage
                ? await uploadImageToHosting({
                    hosting,
                    url: item.renderedImage,
                    projectId,
                    label: "rendered",
                })
                : null;

        // 🔹 Resolve final URLs
        const resolvedSource =
            hostedSource?.url ||
            (isHostedUrl(item.sourceImage) ? item.sourceImage : null);

        if (!resolvedSource) {
            console.error("❌ Source image hosting failed");
            return null;
        }

        const resolvedRender =
            hostedRender?.url ||
            (item.renderedImage && isHostedUrl(item.renderedImage)
                ? item.renderedImage
                : undefined);

        // 🔹 Clean payload
        const {
            sourcePath: _sourcePath,
            renderedPath: _renderedPath,
            publicPath: _publicPath,
            ...rest
        } = item;

        const payload = {
            ...rest,
            sourceImage: resolvedSource,
            renderedImage: resolvedRender,
        };

        console.log("🚀 Sending to worker:", payload);

        const response = await puter.workers.exec(
            `${PUTER_WORKER_URL}/api/projects/save`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // ✅ IMPORTANT
                },
                body: JSON.stringify({
                    project: payload,
                    visibility,
                }),
            }
        );

        if (!response.ok) {
            console.error("❌ Save failed:", await response.text());
            return null;
        }

        const data = (await response.json()) as {
            project?: DesignItem | null;
        };

        console.log("✅ Saved project:", data?.project);

        return data?.project ?? null;
    } catch (e) {
        console.error("❌ Failed to save project:", e);
        return null;
    }
};



// ✅ GET ALL PROJECTS
export const getProjects = async () => {
    if (!PUTER_WORKER_URL) {
        console.warn("❌ Missing VITE_PUTER_WORKER_URL");
        return [];
    }

    try {
        const response = await puter.workers.exec(
            `${PUTER_WORKER_URL}/api/projects/list`,
            { method: "GET" }
        );

        if (!response.ok) {
            console.error("❌ Failed to fetch projects:", await response.text());
            return [];
        }

        const data = (await response.json()) as {
            projects?: DesignItem[] | null;
        };

        return Array.isArray(data?.projects) ? data.projects : [];
    } catch (e) {
        console.error("❌ Failed to get projects:", e);
        return [];
    }
};



// ✅ GET PROJECT BY ID
export const getProjectById = async ({ id }: { id: string }) => {
    if (!PUTER_WORKER_URL) {
        console.warn("❌ Missing VITE_PUTER_WORKER_URL");
        return null;
    }

    try {
        console.log("🔍 Fetching project:", id);

        const response = await puter.workers.exec(
            `${PUTER_WORKER_URL}/api/projects/get?id=${encodeURIComponent(id)}`,
            { method: "GET" }
        );

        if (!response.ok) {
            console.error("❌ Fetch failed:", await response.text());
            return null;
        }

        const data = (await response.json()) as {
            project?: DesignItem | null;
        };

        console.log("✅ Project loaded:", data?.project);

        return data?.project ?? null;
    } catch (error) {
        console.error("❌ Failed to fetch project:", error);
        return null;
    }
};