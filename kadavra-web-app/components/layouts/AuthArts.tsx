import React from "react";

const AuthArts = () => {
	return (
		<div className='pointer-events-none'>
			<img
				className='absolute top-0 right-0 h-[35%] md:h-auto'
				src='/assets/images/auth-art-top.svg'
				alt=''
			/>
			<img
				className='absolute bottom-0 left-0 h-[35%] md:h-auto'
				src='/assets/images/auth-art-bottom.svg'
				alt=''
			/>
		</div>
	);
};

export default AuthArts;
