import { ReactNode } from "react";
import classes from "./Modal.module.scss";
import ReactModal from "react-modal";
// import { CloseCircle } from "../Icons";
// import Clickable from "../utilities/Clickable";

interface ModalProps {
	children?: ReactNode;
	allowClose?: boolean;
	shouldCloseOnOverlayClick?: boolean;
	onRequestClose?: () => void;
	show: boolean;
}

export default function Modal(props: ModalProps) {
	const {
		children,
		show = false,
		shouldCloseOnOverlayClick = true,
		allowClose = true,
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		onRequestClose = () => {},
	} = props;

	return (
		<ReactModal
			isOpen={show}
			shouldCloseOnOverlayClick={allowClose && shouldCloseOnOverlayClick}
			onRequestClose={onRequestClose}
			className='bg-white rounded-[5px] w-full max-w-[600px] m-6 px-6 py-14'
			overlayClassName={classes.overlay}
			ariaHideApp={false}
			closeTimeoutMS={200}>
			<div className='w-[100%]'>{children}</div>
			{allowClose && (
				<button
					className='absolute top-3 right-3'
					aria-label='close'
					onClick={onRequestClose}>
					<svg
						width='24'
						height='24'
						viewBox='0 0 24 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'>
						<path
							fillRule='evenodd'
							clipRule='evenodd'
							d='M5.15164 5.1515C5.37667 4.92654 5.68184 4.80016 6.00004 4.80016C6.31823 4.80016 6.6234 4.92654 6.84844 5.1515L12 10.3031L17.1516 5.1515C17.2623 5.03689 17.3947 4.94547 17.5412 4.88258C17.6876 4.81969 17.845 4.78659 18.0044 4.7852C18.1637 4.78382 18.3217 4.81418 18.4692 4.87452C18.6167 4.93485 18.7506 5.02396 18.8633 5.13663C18.976 5.2493 19.0651 5.38328 19.1254 5.53076C19.1858 5.67823 19.2161 5.83625 19.2147 5.99558C19.2134 6.15492 19.1802 6.31238 19.1174 6.45879C19.0545 6.60519 18.963 6.73761 18.8484 6.8483L13.6968 11.9999L18.8484 17.1515C19.067 17.3778 19.188 17.6809 19.1852 17.9956C19.1825 18.3102 19.0563 18.6112 18.8338 18.8337C18.6113 19.0562 18.3104 19.1824 17.9957 19.1851C17.6811 19.1878 17.378 19.0669 17.1516 18.8483L12 13.6967L6.84844 18.8483C6.62211 19.0669 6.31899 19.1878 6.00435 19.1851C5.68972 19.1824 5.38874 19.0562 5.16625 18.8337C4.94376 18.6112 4.81756 18.3102 4.81483 17.9956C4.81209 17.6809 4.93305 17.3778 5.15164 17.1515L10.3032 11.9999L5.15164 6.8483C4.92667 6.62327 4.80029 6.3181 4.80029 5.9999C4.80029 5.68171 4.92667 5.37654 5.15164 5.1515Z'
							fill='#25324B'
						/>
					</svg>
				</button>
			)}
		</ReactModal>
	);
}

// export default function Modal(props: ModalProps) {
//   const { children, show = false } = props;
//   const [destroy, setDestroy] = useState<boolean>(true);

//   useEffect(() => {
//     if (show) {
//       setDestroy(false);
//     }
//   }, [show]);

//   return (
//     <>
//       {!destroy && (
//         <div
//           style={{
//             opacity: show ? 1 : 0,
//             transform: `${show ? "scale(1)" : "scale(0.5)"}`,
//           }}
//           onTransitionEnd={() => setDestroy(true)}
//           className={classes.modal}
//         >
//           <div className={classes.body}>{children}</div>
//         </div>
//       )}
//     </>
//   );
// }
