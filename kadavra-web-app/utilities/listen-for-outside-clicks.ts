export default function listenForOutsideClicks<Props>(
	listening: boolean,
	setListening: (listening: boolean) => void,
	menuRef: React.RefObject<HTMLDivElement> | any,
	setIsOpen: (isOpen: boolean) => void
) {
	return () => {
		if (listening) return;
		if (!menuRef.current) return;
		setListening(true);
		[`click`, `touchstart`].forEach((type) => {
			document.addEventListener(`click`, (evt) => {
				const cur = menuRef.current;
				const node = evt.target;
				try {
					if (cur.contains(node)) return;
					setIsOpen(false);
				} catch (error) {}
			});
		});
	};
}
