// lib/legislative-import/index.ts
// Main entry point — exports and factory functions

export * from './types';
export * from './config';

export { EurLexAdapter } from './adapters/eurlex-adapter';
export { BgLexAdapter } from './adapters/bg-adapter';
export { LegislativeTranslator } from './processors/translator';
export { LegislativeStructurer } from './processors/structurer';
export { ImportPipeline } from './pipelines/initial-import';
export { UpdateCheckPipeline } from './pipelines/update-check';
