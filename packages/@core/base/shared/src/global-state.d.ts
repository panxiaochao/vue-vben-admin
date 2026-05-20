interface ComponentsState {
  [key: string]: any;
}
interface MessageState {
  copyPreferencesSuccess?: (title: string, content?: string) => void;
}
export interface IGlobalSharedState {
  components: ComponentsState;
  message: MessageState;
}
declare class GlobalShareState {
  #private;
  defineMessage({ copyPreferencesSuccess }: MessageState): void;
  getComponents(): ComponentsState;
  getMessage(): MessageState;
  setComponents(value: ComponentsState): void;
}
export declare const globalShareState: GlobalShareState;

