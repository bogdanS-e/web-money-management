let isGooglePending = false;
let isFacebookPending = false;

export const addScript = (
  id: string,
  src: string,
  isPending: boolean,
  onFinish: () => void,
  onStart: () => void,
) => {
  if (isPending) {
    return new Promise((resolve, reject) => {
      const script = document.getElementById(id);

      if (!script) {
        reject();
        return;
      }

      script.addEventListener('load', resolve);
      script.addEventListener('error', () =>
        reject(new Error(`Error loading ${id}.`)),
      );
      script.addEventListener('abort', () =>
        reject(new Error(`${id}  loading aborted.`)),
      );
    });
  }

  return new Promise((resolvePromise, rejectPromise) => {
    onStart();

    const resolve = (param?: any) => {
      onFinish();
      resolvePromise(param);
    };

    const reject = (param?: any) => {
      onFinish();
      rejectPromise(param);
    };

    const element = document.getElementById(id);

    if (element) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');

    script.setAttribute('type', 'text/javascript');
    script.setAttribute('id', id);
    script.setAttribute('src', src);
    script.addEventListener('load', resolve);
    script.addEventListener('error', () =>
      reject(new Error(`Error loading ${id}.`)),
    );
    script.addEventListener('abort', () =>
      reject(new Error(`${id}  loading aborted.`)),
    );

    document.getElementsByTagName('head')[0].appendChild(script);
  });
};

export const addFacebookScript = () => {
  const id = 'facebookAuth';
  const src = 'https://connect.facebook.net/en_US/sdk.js';

  return addScript(
    id,
    src,
    isFacebookPending,
    () => {
      isFacebookPending = false;
    },
    () => {
      isFacebookPending = true;
    },
  );
};

export const addGoogleScript = () => {
  const id = 'googleAuth';
  const src = '//apis.google.com/js/client:platform.js';

  return addScript(
    id,
    src,
    isGooglePending,
    () => {
      isGooglePending = false;
    },
    () => {
      isGooglePending = true;
    },
  );
};
