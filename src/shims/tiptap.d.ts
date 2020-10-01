declare module 'tiptap-extensions' {
  import { Extension, Node, Mark } from 'tiptap';
  import {
    NodeSpec,
    NodeType,
    MarkType,
    MarkSpec,
    MarkType,
    Node as ProsemirrorNode,
    NodeSpec,
    NodeType,
    ParseOptions,
    Schema,
  } from 'prosemirror-model';

  export interface PlaceholderOptions {
    emptyNodeClass?: string;
    emptyNodeText?: string;
    showOnlyWhenEditable?: boolean;
    showOnlyCurrent?: boolean;
    emptyEditorClass: string;
  }
  export class Placeholder extends Extension {
    constructor(options?: PlaceholderOptions);
  }

  export interface TrailingNodeOptions {
    /**
     * Node to be at the end of the document
     *
     * defaults to 'paragraph'
     */
    node: string;
    /**
     * The trailing node will not be displayed after these specified nodes.
     */
    notAfter: string[];
  }
  export class TrailingNode extends Extension {
    constructor(options?: TrailingNodeOptions);
  }

  export interface HeadingOptions {
    levels?: number[];
  }

  export class History extends Extension {}
  export class Underline extends Mark {}
  export class Strike extends Mark {}
  export class Italic extends Mark {}
  export class Bold extends Mark {}
  export class BulletList extends Node {}
  export class ListItem extends Node {}
  export class OrderedList extends Node {}
  export class HardBreak extends Node {}
  export class Blockquote extends Node {}
  export class CodeBlock extends Node {}
  export class TodoItem extends Node {}
  export class Code extends Node {}
  export class HorizontalRule extends Node {}
  export class Link extends Node {}
  export class TodoList extends Node {}
  export class Image extends Node {}

  export class Heading extends Node {
    constructor(options?: HeadingOptions);
  }

  export class Table extends Node {}
  export class TableCell extends Node {}
  export class TableRow extends Node {}
  export class TableHeader extends Node {}
}

declare module 'tiptap-commands' {
  import { EditorView, EditorProps, EditorView } from 'prosemirror-view';
  import {
    Transaction,
    EditorState,
    Plugin,
    EditorState,
    Plugin,
    Transaction,
  } from 'prosemirror-state';
  import { InputRule } from 'prosemirror-inputrules';

  export interface DispatchFn {
    (tr: Transaction): boolean;
  }

  export interface Command {
    (...params: any[]): CommandFunction;
  }

  export interface CommandFunction {
    (state: EditorState, dispatch: DispatchFn | undefined, view: EditorView): boolean;
  }

  export function toggleWrap(type: NodeType): Command;

  export function wrappingInputRule(
    regexp: RegExp,
    nodeType: NodeType,
    getAttrs?: (arg: Record | string[]) => Record | undefined,
    joinPredicate?: (strs: string[], node: Node) => boolean
  ): InputRule;

  export function toggleMark(type: MarkType, attrs?: { [key: string]: any }): Command;

  export function pasteRule(
    regexp: RegExp,
    type: string,
    getAttrs: (() => { [key: string]: any }) | { [key: string]: any }
  ): Plugin;
}

declare module 'tiptap' {
  import { Command, CommandFunction } from 'tiptap-commands';

  import { VueConstructor } from 'vue';

  export const EditorContent: VueConstructor;
  export const EditorMenuBubble: VueConstructor;
  export const EditorMenuBar: VueConstructor;
  export type ExtensionOption = Extension | Node | Mark;

  // there are some props available
  // `node` is a Prosemirror Node Object
  // `updateAttrs` is a function to update attributes defined in `schema`
  // `view` is the ProseMirror view instance
  // `options` is an array of your extension options
  // `selected`
  export interface NodeView {
    /** A Prosemirror Node Object */
    node?: ProsemirrorNode;
    /** A function to update attributes defined in `schema` */
    updateAttrs?: (attrs: { [key: string]: any }) => any;
    /** The ProseMirror view instance */
    view?: EditorView;
    /** An array of your extension options */
    options?: { [key: string]: any };
    /** Whether the node view is selected */
    selected?: boolean;
  }

  export type CommandGetter =
    | { [key: string]: (() => Command) | Command }
    | (() => Command)
    | Command
    | (() => Command)[];

  export interface EditorUpdateEvent {
    state: EditorState;
    getHTML: () => string;
    getJSON: () => Record;
    transaction: Transaction;
  }

  export interface EditorOptions {
    editorProps?: EditorProps;
    /** defaults to true */
    editable?: boolean;
    /** defaults to false */
    autoFocus?: boolean;
    extensions?: ExtensionOption[];
    content?: Record<string, any> | string;
    emptyDocument?: {
      type: 'doc';
      content: [
        {
          type: 'paragraph';
        }
      ];
    };
    /** defaults to false */
    useBuiltInExtensions?: boolean;
    /** defaults to false */
    disableInputRules?: boolean;
    /** defaults to false */
    disablePasteRules?: boolean;
    dropCursor?: Record;
    parseOptions?: ParseOptions;
    /** defaults to true */
    injectCSS?: boolean;
    onInit?: ({ view, state }: { view: EditorView; state: EditorState }) => void;
    onTransaction?: (event: EditorUpdateEvent) => void;
    onUpdate?: (event: EditorUpdateEvent) => void;
    onFocus?: ({
      event,
      state,
      view,
    }: {
      event: FocusEvent;
      state: EditorState;
      view: EditorView;
    }) => void;
    onBlur?: ({
      event,
      state,
      view,
    }: {
      event: FocusEvent;
      state: EditorState;
      view: EditorView;
    }) => void;
    onPaste?: (...args: any) => void;
    onDrop?: (...args: any) => void;
  }

  export class Editor {
    commands: { [key: string]: Command };
    defaultOptions: { [key: string]: any };
    element: Element;
    extensions: Extension[];
    inputRules: any[];
    keymaps: any[];
    marks: Mark[];
    nodes: Node[];
    pasteRules: any[];
    plugins: Plugin[];
    schema: Schema;
    state: EditorState;
    view: EditorView;
    activeMarks: { [markName: string]: () => boolean };
    activeNodes: { [nodeName: string]: () => boolean };
    activeMarkAttrs: { [markName: string]: { [attr: string]: any } };

    /**
     * Creates an [Editor]
     * @param options - An object of Editor options.
     */
    constructor(options?: EditorOptions);

    /**
     * Replace the current content. You can pass an HTML string or a JSON document that matches the editor's schema.
     * @param content Defaults to {}.
     * @param emitUpdate Defaults to false.
     */
    setContent(content?: string | Record, emitUpdate?: boolean): void;

    /**
     * Clears the current editor content.
     *
     * @param emitUpdate Whether or not the change should trigger the onUpdate callback.
     */
    clearContent(emitUpdate?: boolean): void;

    /**
     * Overwrites the current editor options.
     * @param options Options an object of Editor options
     */
    setOptions(options: EditorOptions): void;

    /**
     * Register a ProseMirror plugin.
     * @param plugin
     */
    registerPlugin(plugin: Plugin): void;

    /** Get the current content as JSON. */
    getJSON(): Record;

    /** Get the current content as HTML. */
    getHTML(): string;

    /** Focus the editor */
    focus(): void;

    /** Removes the focus from the editor. */
    blur(): void;

    /** Destroy the editor and free all Prosemirror-related objects from memory.
     * You should always call this method on beforeDestroy() lifecycle hook of the Vue component wrapping the editor.
     */
    destroy(): void;

    on(event: string, callbackFn: (params: any) => void): void;

    off(event: string, callbackFn: (params: any) => void): void;

    getMarkAttrs(markName: string): { [attributeName: string]: any };
  }

  export class Extension<Options = any> {
    /** Define a name for your extension */
    name?: string | null;
    /** Define some default options.The options are available as this.$options. */
    defaultOptions?: Options;
    /** Define a list of Prosemirror plugins. */
    plugins?: Plugin[];
    /** Called when options of extension are changed via editor.extensions.options */
    update?: (view: EditorView) => any;
    /** Options for that are either passed in from the extension constructor or set by defaultOptions() */
    options?: Options;

    constructor(options?: Options);

    /** Define some keybindings. */
    keys?({
      schema,
    }: {
      schema: Schema | NodeSpec | MarkSpec;
    }): { [keyCombo: string]: CommandFunction };

    /** Define commands. */
    commands?({
      schema,
      attrs,
    }: {
      schema: Schema | NodeSpec | MarkSpec;
      attrs: { [key: string]: string };
    }): CommandGetter;

    inputRules?({ schema }: { schema: Schema }): any[];

    pasteRules?({ schema }: { schema: Schema }): Plugin[];
  }

  export class Node<V extends NodeView = any> extends Extension {
    schema?: NodeSpec;
    /** Reference to a view component constructor
     *  See https://stackoverflow.com/questions/38311672/generic-and-typeof-t-in-the-parameters
     */
    view?: { new (): V };

    commands?({
      type,
      schema,
      attrs,
    }: {
      type: NodeType;
      schema: NodeSpec;
      attrs: { [key: string]: string };
    }): CommandGetter;

    keys?({
      type,
      schema,
    }: {
      type: NodeType;
      schema: NodeSpec;
    }): { [keyCombo: string]: CommandFunction };

    inputRules?({ type, schema }: { type: NodeType; schema: Schema }): any[];

    pasteRules?({ type, schema }: { type: NodeType; schema: Schema }): Plugin[];
  }

  export class Mark<V extends NodeView = any> extends Extension {
    schema?: MarkSpec;
    /** Reference to a view component constructor
     *  See https://stackoverflow.com/questions/38311672/generic-and-typeof-t-in-the-parameters
     */
    view?: { new (): V };

    commands?({
      type,
      schema,
      attrs,
    }: {
      type: MarkType;
      schema: MarkSpec;
      attrs: { [key: string]: string };
    }): CommandGetter;

    keys?({
      type,
      schema,
    }: {
      type: MarkType;
      schema: MarkSpec;
    }): { [keyCombo: string]: CommandFunction };

    inputRules?({ type, schema }: { type: MarkType; schema: Schema }): any[];

    pasteRules?({ type, schema }: { type: MarkType; schema: Schema }): Plugin[];
  }

  export class Text extends Node {}

  export class Paragraph extends Node {}

  export class Doc extends Node {}

  /** A set of commands registered to the editor. */
  export interface EditorCommandSet {
    [key: string]: Command;
  }

  /**
   * The properties passed into <editor-menu-bar /> component
   */
  export interface MenuData {
    /** Whether the editor has focus. */
    focused: boolean;
    /** Function to focus the editor. */
    focus: () => void;
    /** A set of commands registered. */
    commands: EditorCommandSet;
    /** Check whether a node or mark is currently active. */
    isActive: IsActiveChecker;
    /** A function to get all mark attributes of the current selection.  */
    getMarkAttrs: (markName: string) => { [attributeName: string]: any };
  }

  export interface FloatingMenuData extends MenuData {
    /** An object for positioning the menu. */
    menu: MenuDisplayData;
  }

  /**
   * A data object passed to a menu bubble to help it determine its position
   * and visibility.
   */
  export interface MenuDisplayData {
    /** Left position of the cursor. */
    left: number;
    /** Bottom position of the cursor. */
    bottom: number;
    /** Whether or not there is an active selection. */
    isActive: boolean;
  }

  /**
   * A map containing functions to check if a node/mark is currently selected.
   * The name of the node/mark is used as the key.
   */
  export interface IsActiveChecker {
    [name: string]: () => boolean;
  }
}
