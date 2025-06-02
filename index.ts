import { CustomCrosshairMod, HelpfulCrosshair } from '@/projects.ts';

interface IFinalResult {
    readonly project: string;
    readonly source: string;
    readonly dataType: string;
    readonly count: number;
}

const projects = [
    new CustomCrosshairMod(),
    new HelpfulCrosshair(),
];

const results: Array<IFinalResult> = [];

for (const project of projects) {
    for (const retriever of project.retrievers) {
        try {
            const result = await retriever.retrieve();

            results.push(...result.map(x => ({
                project: project.title,
                source: retriever.name,
                dataType: x.name,
                count: x.count,
            })));
        }
        catch (error) {}
    }
}

console.log(results);