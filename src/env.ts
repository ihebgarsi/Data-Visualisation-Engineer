type DevtoolsHook = {
  inject?: (...args: unknown[]) => void;
  supportsFiber?: boolean;
  renderers?: { clear?: () => void };
};

const hook = (window as Window & { __REACT_DEVTOOLS_GLOBAL_HOOK__?: DevtoolsHook })
  .__REACT_DEVTOOLS_GLOBAL_HOOK__;

if (hook) {
  hook.inject = () => undefined;
  hook.supportsFiber = false;
  hook.renderers?.clear?.();
}
