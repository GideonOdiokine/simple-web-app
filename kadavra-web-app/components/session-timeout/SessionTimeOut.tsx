import React, { useEffect, useState } from "react";
import Button from "../global/Button";
import IdleJs from "idle-js";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setSessionTimedOut } from "src/features/auth/authSlice";

const SessionTimeOut = () => {
	const [time, setTime] = useState(60);
	const [showWarning, setShowWarning] = useState(false);
	const dispatch = useDispatch();

	const location = useRouter();

	useEffect(() => {
		if (!showWarning) return;
		const timer = setInterval(() => {
			setTime((prevTime) => prevTime - 1);
		}, 1000);
		return () => clearInterval(timer);
	}, [showWarning]);

	useEffect(() => {
		if (time === 0) {
			logUserOut();
		}
	}, [time]);

	const onIdle = () => {
		setShowWarning(true);
	};

	const idle = new IdleJs({
		// idle: 5000, // idle time in ms for testing
		idle: 1000 * 2 * 60, // idle time in ms
		events: ["mousemove", "keydown", "mousedown", "touchstart"], // events that will trigger the idle resetter
		onIdle: onIdle, // callback function to be executed after idle time
		onActive: function () {}, // callback function to be executed after back form idleness
		onHide: function () {}, // callback function to be executed when window become hidden
		onShow: function () {}, // callback function to be executed when window become visible
		keepTracking: true, // set it to false if you want to be notified only on the first idleness change
		startAtIdle: false, // set it to true if you want to start in the idle state
	});

	const stopSessionTimeout = () => {
		setShowWarning(false);
		idle.stop();
	};

	const initSessionTimeout = () => {
		dispatch(setSessionTimedOut(false));
		idle.start();
	};

	const retrieveSessionTimeout = () => {
		stopSessionTimeout();
		setTime(60);
		idle.reset();
		idle.start();
	};

	const logUserOut = () => {
		stopSessionTimeout();
		Cookies.remove("kadavraUserDetails");
		Cookies.remove("kadavraToken");
		dispatch(setSessionTimedOut(true));
		setTimeout(() => location.push("/auth/login"), 100);
	};

	useEffect(() => {
		initSessionTimeout();

		return () => {
			stopSessionTimeout();
		};
	}, []);

	if (!showWarning) return null;

	return (
		<div className='bg-[#061A14D9] fixed z-[999999999999] top-0 left-0 right-0 bottom-0'>
			<div className='container w-full h-full flex items-center justify-center'>
				<div className='w-full max-w-[500px] text-center text-white space-y-8'>
					<p className='text-sm md:text-base'>Logging you out in...</p>
					<div className='text-6xl md:text-8xl font-bold animate-ping'>
						{time}
					</div>
					<p className='text-sm md:text-base'>
						You have been inactive for about <b>2 minutes</b> and will be logged
						out once the timer runs out, if you do not retrieve your session.
					</p>
					<p className='text-accent-yellow text-sm md:text-base'>
						Click on the "Retrieve Session" button below to retrieve session or
						click on the "Logout" button to logout
					</p>
					<div className='flex gap-4 flex-col md:flex-row-reverse items-center justify-center md:space-x-4'>
						<Button
							size='sm'
							className='w-full md:w-auto'
							onClick={retrieveSessionTimeout}>
							Retrieve Session
						</Button>
						<Button
							size='sm'
							onClick={logUserOut}
							className='bg-error w-full md:w-auto'>
							Logout
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SessionTimeOut;
