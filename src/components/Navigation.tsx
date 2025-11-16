export const Navigation = () => {
	return (
		<header className="sticky top-5 z-20 mx-auto w-full max-w-6xl px-4 ">
			<nav className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
				<a href="#" className="font-semibold tracking-tight">
					MctQ
				</a>
				<ul className="hidden gap-8 text-sm md:flex">
					<li>
						<a className="text-white/70 hover:text-white" href="#">
							Home
						</a>
					</li>
					<li>
						<a className="text-white/70 hover:text-white" href="#popular">
							Explore
						</a>
					</li>
					<li>
						<a className="text-white/70 hover:text-white" href="#login">
							Log in
						</a>
					</li>
				</ul>
				<a
					href="#start"
					className="md:hidden rounded-full bg-[#FF446D] px-4 py-2 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
				>
					Start
				</a>
			</nav>
		</header>
	);
};
