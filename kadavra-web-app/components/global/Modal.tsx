import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Modal = ({ show, onClose, children }) => {
	const [isBrowser, setIsBrowser] = useState(false);

	useEffect(() => {
		setIsBrowser(true);
	}, []);

	// const handleCloseClick = (e: any) => {
	// 	e.preventDefault();
	// 	onClose();
	// };

	const closeModal = (e: any) => {
		if (e.target.classList.contains("container")) {
			onClose();
		}
	};

	const modalContent = show ? (
		<section className='fixed z-[5000] top-0 left-0 right-0 bottom-0 bg-[#061A1480]'>
			<div
				onClick={closeModal}
				className='container w-full h-full flex items-center justify-center'>
				<section className='w-full max-w-[675px] z-10 py-16 bg-white rounded-xl kadavra-shadow'>
					<div className='w-full max-w-[479px] mx-auto space-y-[40px] p-6'>
						{children}
					</div>
				</section>
			</div>
		</section>
	) : null;

	if (isBrowser) {
		return ReactDOM.createPortal(
			modalContent,
			document.getElementById("modal-root")
		);
	} else {
		return null;
	}
};

export default Modal;
