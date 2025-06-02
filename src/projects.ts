import { CurseForgeRetriever, ModrinthRetriever, PastebinRetriever, type Retriever } from '@/retrievers.ts';

export abstract class Project {
    abstract readonly title: string;
    abstract readonly retrievers: Array<Retriever>;
}

export class CustomCrosshairMod extends Project {
    public readonly title = 'Custom Crosshair Mod';

    public readonly retrievers = [
        new ModrinthRetriever('o1tyE5vJ'),
        new CurseForgeRetriever('242995'),
        new PastebinRetriever('B2sL8QCh'),
    ];
}

export class HelpfulCrosshair extends Project {
    public readonly title = 'Helpful Crosshair';

    public readonly retrievers = [
        new ModrinthRetriever('7M5J9JvV'),
        new CurseForgeRetriever('1105824'),
        new PastebinRetriever('Li4QBpHi'),
    ];
}