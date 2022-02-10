import {
  MutableRefObject,
  ReactNode,
  ReactPortal,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import ReactDOM from 'react-dom';

interface handlePortal {
  createPortal: (reactElement: ReactNode) => ReactPortal,
  showPortal: () => void;
  hidePortal: () => void;
  togglePortal: () => void;
}

type UsePortal = [
  handlePortal,
  MutableRefObject<HTMLElement>,
]

const usePortal = (isShown: boolean = true, id?: string): UsePortal => {
  const element = useMemo(() => {
    const domElement = document.createElement('div');
    if (id) {
      domElement.setAttribute('id', id);
    }
    return domElement;
  }, [id]);

  const ref = useRef(element);

  useEffect(() => {
    if (!isShown) return;

    document.body.appendChild(ref.current);

    return () => {
      document.body.removeChild(ref.current);
    };
  }, [id, isShown]);

  const createPortal = (reactElement: ReactNode) => {
    return ReactDOM.createPortal(reactElement, ref.current);
  };

  const showPortal = () => {
    document.body.appendChild(ref.current);
  };

  const hidePortal = () => {
    document.body.removeChild(ref.current);
  };

  const togglePortal = () => {
    if (document.body.contains(ref.current)) {
      hidePortal();
      return;
    }

    showPortal();
  };

  return [
    {
      createPortal,
      showPortal,
      hidePortal,
      togglePortal,
    },
    ref,
  ];
};

export default usePortal;
