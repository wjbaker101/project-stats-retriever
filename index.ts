import { appendFile } from 'node:fs/promises';

import { CustomCrosshairMod, HelpfulCrosshair } from '@/projects.ts';

interface IFinalResult {
    readonly projectIdentifier: string;
    readonly retrieverIdentifier: string;
    readonly dataType: string;
    readonly count: number;
}

const projects = [
    new CustomCrosshairMod(),
    new HelpfulCrosshair(),
];

const results: Array<IFinalResult> = [];

await retrieve();
await save();

async function retrieve() {
    for (const project of projects) {
        for (const retriever of project.retrievers) {
            try {
                const result = await retriever.retrieve();

                results.push(...result.map(x => ({
                    projectIdentifier: project.identifier,
                    retrieverIdentifier: retriever.identifier,
                    dataType: x.name,
                    count: x.count,
                })));
            }
            catch (error) {}
        }
    }
}

async function save() {
    const now = new Date().toISOString().split('.')[0];

    for (const result of results) {
        const fileName = `./output/${result.projectIdentifier}+${result.retrieverIdentifier}+${result.dataType}.txt`;
        const file = Bun.file(fileName);

        if (await file.exists() === false) {
            await Bun.write(file, '');
        }

        await appendFile(fileName, `${now}\t${result.count}\n`);
    }
}