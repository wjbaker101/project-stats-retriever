import { JSDOM } from 'jsdom';

export interface IRetrieveResult {
    readonly name: string;
    readonly count: number;
}

export abstract class Retriever {
    abstract readonly name: string;
    abstract readonly identifier: string;
    abstract retrieve(): Promise<Array<IRetrieveResult>>;
}

export class ModrinthRetriever extends Retriever {

    public readonly name = 'Modrinth';
    public readonly identifier = 'modrinth';

    constructor(private projectId: string) {
        super();
    }

    public async retrieve(): Promise<Array<IRetrieveResult>> {
        const url = `https://api.modrinth.com/v2/project/${this.projectId}`;

        const response = await fetch(url);

        const json = await response.json() as Readonly<{
            downloads: number;
            followers: number;
        }>;

        return [
            {
                name: 'downloads',
                count: json.downloads,
            },
            {
                name: 'followers',
                count: json.followers,
            },
        ];
    }
}

export class CurseForgeRetriever extends Retriever {

    public readonly name = 'CurseForge';
    public readonly identifier = 'curseforge';

    constructor(private modId: string) {
        super();
    }

    public async retrieve(): Promise<Array<IRetrieveResult>> {
        const url = `https://api.curseforge.com/v1/mods/${this.modId}`;

        const response = await fetch(url, {
            headers: {
                'x-api-key': process.env.CURSEFORGE_API_KEY as string,
            },
        });

        const json = await response.json() as Readonly<{
            data: {
                downloadCount: number;
            };
        }>;

        return [
            {
                name: 'downloads',
                count: json.data.downloadCount,
            },
        ];
    }
}

export class PastebinRetriever extends Retriever {

    public readonly name = 'Pastebin';
    public readonly identifier = 'pastebin';

    constructor(private pasteKey: string) {
        super();
    }

    public async retrieve(): Promise<Array<IRetrieveResult>> {
        const url = `https://pastebin.com/${this.pasteKey}`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': process.env.USER_AGENT as string,
            },
        });

        const text = await response.text();
        const html = new JSDOM(text);

        const element = html.window.document.querySelector('.visits');
        if (element === null) {
            return [];
        }

        const views = element.textContent?.replaceAll(',', '');

        return [
            {
                name: 'views',
                count: Number(views),
            },
        ];
    }

}