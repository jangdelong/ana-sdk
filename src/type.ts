declare global {
  interface Window {
    _ERR_LOCK_: any
  }
}

export interface Client {
  sendEvent(): string;
}

export interface Options {
  debug?: boolean;
  enabled?: boolean;

  server?: string;
  appId: string,
  secret: string,

  sampleRate?: number,
  ignoreErrors?: Array<string | RegExp>;

  env?: string;
  maxBreadcrumbs?: number;

  beforeSend?: Event | null | Promise<EventData | null>;
  beforeBreadcrumb?: Breadcrumb | null | Promise<Breadcrumb | null>
}

export interface Breadcrumb {
  type?: string;
  level?: string;
  event_id?: string;
  category?: string;
  message?: string;
  data?: any;
  timestamp?: number;
}

export interface SdkInfo {
  name: string;
  version: string;
}

export interface EventData {
  event_id?: string;
  message?: string;
  timestamp?: number;
  level?: number;
  platform?: string;
  logger?: string;
  server_name?: string;
  release?: string;
  dist?: string;
  environment?: string;
  sdk?: string;
  request?: Request;
  transaction?: string;
  modules?: { [key: string]: string };
  fingerprint?: string[];
  exception?: {
    values?: ExceptionData[];
    mechanism?: Mechanism;
  };
  stacktrace?: Stacktrace;
  breadcrumbs?: Breadcrumb[];
  contexts?: { [key: string]: object };
  tags?: { [key: string]: string };
  extra?: { [key: string]: any };
  user?: User;
}

export interface Request {
  url?: string;
  method?: string;
  data?: any;
  query_string?: string;
  cookies?: { [key: string]: string };
  env?: { [key: string]: string };
  headers?: { [key: string]: string };
}

export interface Mechanism {
  type: string;
  handled: boolean;
  data?: {
    [key: string]: string;
  };
}

export interface User {
  [key: string]: any;

  id?: string;
  username?: string;
  phone?: string;
}

export interface StackFrame {
  filename?: string;
  function?: string;
  module?: string;
  platform?: string;
  lineno?: number;
  colno?: number;
  abs_path?: string;
  context_line?: string;
  pre_context?: string[];
  post_context?: string[];
  in_app?: boolean;
  vars?: { [key: string]: any };
}

export interface Stacktrace {
  frames?: StackFrame[];
  frames_omitted?: [number, number];
}

export interface ExceptionData {
  type?: string;
  value?: string;
  module?: string;
  thread_id?: number;
  stacktrace?: Stacktrace;
}
