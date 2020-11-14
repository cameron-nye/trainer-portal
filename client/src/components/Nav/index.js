import React, { useState, useRef, useEffect, useContext } from "react"
import { HiMenuAlt4, HiOutlineX } from "react-icons/hi"
import GlobalContext from "../../context/GlobalContext"

import "./index.scss"

const Nav = () => {
	const [ isOpen, setIsOpen ] = useState(false)
  const drawer = useRef(null)
  const {user} = useContext(GlobalContext)

	useEffect(
		() => {
			if (!isOpen) return
			const handleOffClick = e => {
				const clickedInDrawer = e.target === drawer.current || e.target === drawer.current.contains(e.target)
				if (clickedInDrawer) return
				setIsOpen(false)
			}
			window.addEventListener("click", handleOffClick)
			return () => window.removeEventListener("click", handleOffClick)
		},
		[ isOpen ]
	)

	const navLinks = [
		{
			title: "Schedule Workout",
			href: "/session",
			navSection: "top"
		},
		{
			title: "Clients",
			href: "/clients",
			navSection: "top"
		},
		{
			title: "Workouts",
			href: "/workout-manager",
			navSection: "top"
		},
		{
			title: "Exercises",
			href: "/exercise-manager",
			navSection: "top"
		},
		{
			title: "Profile",
			href: "/profile",
			navSection: "bottom"
		},
		{
			title: "Sign Out",
			href: "/",
      navSection: "bottom",
      onClick: () => {
        localStorage.removeItem('user')
      }
		}
	]

	return (
		<div className="nav">
			<HiMenuAlt4 onClick={() => setIsOpen(true)} color={"#F2D479"} size={24} className="icon" />
      {!!user && <h3>{`${user.firstName} ${user.lastName}`}</h3> }
			<div className={`drawer ${isOpen && "open"}`} ref={drawer}>
				<ul className="top">
					<li onClick={() => setIsOpen(false)}>
						<HiOutlineX className="icon" color={"#313640"} size={24} onClick={() => setIsOpen(false)} />
					</li>
					{navLinks.filter(nl => nl.navSection === "top").map((nl, i) => {
						return (
							<li key={i}>
								<a href={nl.href}>{nl.title}</a>
							</li>
						)
					})}
				</ul>
				<ul className="bottom">
					{navLinks.filter(nl => nl.navSection === "bottom").map((nl, i) => {
						return (
							<li key={i} onClick={nl.onClick ? nl.onClick : () => {}}>
								<a href={nl.href}>{nl.title}</a>
							</li>
						)
					})}
				</ul>
			</div>
		</div>
	)
}

export default Nav
