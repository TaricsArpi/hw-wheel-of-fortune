import Image from "next/image";
import Link from "next/link";
import logo from "../../public/logo.png";

const Navbar = () => {
	return (
		<div className="fixed top-0 right-0 left-0">
			<div className="container flex items-center justify-center m-auto">
				<Link href="/" prefetch={false}>
					<Image src={logo} alt="logo" style={{ maxWidth: "200px" }} priority />
				</Link>
			</div>
		</div>
	);
};

export default Navbar;
