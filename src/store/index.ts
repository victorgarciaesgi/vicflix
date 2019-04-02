export const DebugMode: boolean = process.env.DEBUG_MODE == 'true';
export * from './Modules';
if (module.hot) {
  module.hot.accept();
}
