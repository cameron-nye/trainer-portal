import React, { useState, useRef, useEffect } from "react"
import { HiMenuAlt4, HiOutlineX } from "react-icons/hi"

import "./index.scss"

const Nav = () => {
	const [ isOpen, setIsOpen ] = useState(false)
	const drawer = useRef(null)

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
			href: "/schedule-workout",
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
			navSection: "bottom"
		}
	]

	return (
		<div className="nav">
			<HiMenuAlt4 onClick={() => setIsOpen(true)} color={"#F2D479"} size={24} className="icon" />
			<h1>
				<a href="/">
					Athena Fitness
				</a>
			</h1>
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
							<li key={i}>
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
