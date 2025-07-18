

export interface DesignOutput {
  htmlCode: string;
}

export interface HistoryItem {
  id: string;
  prompt: string;
  designOutput: DesignOutput;
}

export interface Toast {
    id:string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
}

export interface ExampleItem {
    prompt: string;
    htmlCode: string;
}

export interface Project {
  id: string;
  title: string;
  history: HistoryItem[];
  activeDesign: DesignOutput | null;
  isComponentMode: boolean;
  lastModified: number;
  convertedCodeCache: Record<string, string>;
}
