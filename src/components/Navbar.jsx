import React, { useEffect, useRef, useState } from 'react'
import Button from './Button';
import { TiLocationArrow } from 'react-icons/ti';
import { useWindowScroll } from 'react-use';
import gsap from 'gsap';

// For accessing quickly to elements in Navbar
const navItems = ['Nexus', 'Vault', 'Prologue', 'About', 'Contact'];

const Navbar = () => {

    // When audio is playing
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    // When indicator ( waves ) active while playing
    const [isIndicatorActive, setIsIndicatorActive] = useState(false);

    // Variable for navBar visibility
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isNavVisible, setIsNavVisible] = useState(true);

    const navContainerRef = useRef(null); // Animated Navbar

    // Making audio loop from Navbar
    const audioElementRef = useRef(null);
    const toggleAudioIndicator = () => {
        setIsAudioPlaying((prev) => !prev);
        setIsIndicatorActive((prev) => !prev);
    }
    
    // Get y-property from user scroll
    const { y: currentScrollY }= useWindowScroll();
    useEffect(() => {
        // When we at topmost position
        if (currentScrollY === 0) {
            setIsNavVisible(true);
            navContainerRef.current.classList.remove('floating-nav')
        } else if (currentScrollY > lastScrollY) { 
            // User scroll down, hide Navbar and applying new class into ref
            setIsNavVisible(false);
            navContainerRef.current.classList.add('floating-nav')
        } else if (currentScrollY < lastScrollY) { 
            // // User scroll down, show Navbar and applying new class into ref
            setIsNavVisible(true);
            navContainerRef.current.classList.add('floating-nav')
        }

        // Changing lastScrollY
        setLastScrollY(currentScrollY)
    }, [currentScrollY, lastScrollY])

    useEffect(() => {
        gsap.to(navContainerRef.current, {
            y: isNavVisible ? 0 : -100,
            opacity: isNavVisible ? 1 : 0,
            duration: 0.2,
        })
    }, [isNavVisible])

    useEffect(() => {
        if(isAudioPlaying) {
            audioElementRef.current.play();
        } else {
            audioElementRef.current.pause();
        }
    }, [isAudioPlaying])
        
    return (
        <div ref={navContainerRef} className='fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6'>
            <header className='absolute top-1/2 w-full -translate-y-1/2'>
                <nav className='flex size-full items-center justify-between p-4'>
                    {/* Logo and Product button */}
                    <div className='flex items-center gap-7'>
                        <img src='/img/logo.png' alt='logo' className='w-10' />
                        <Button 
                            id="product-button"
                            title="Products"
                            rightIcon={<TiLocationArrow/>}
                            containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
                        />
                    </div>

                    {/* Navigation Links and Audio Button */}
                    <div className='flex h-full items-center'>
                        <div className='hidden md:block'>
                            {navItems.map((item, index) => (
                                <a key={index} href={`#${item.toLowerCase()}`} className='nav-hover-btn'>
                                    {item}
                                </a>
                            ))}
                        </div>

                        <button onClick={toggleAudioIndicator} className='ml-10 flex items-center space-x-0.5'>
                            <audio ref={audioElementRef} className='hidden' src='/audio/loop.mp3' loop />
                                {[1, 2, 3, 4].map((bar) => (
                                    <div key={bar} className={`indicator-line ${isIndicatorActive ? 'active' : ''}`} style={{ animationDelay: `${bar * 0.1}s`}}>

                                    </div>
                                ))}
                        </button>
                    </div>
                </nav>
            </header>
        </div>
    )
}

export default Navbar