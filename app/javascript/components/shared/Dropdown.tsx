/* This example requires Tailwind CSS v2.0+ */
import React, { ReactNode } from 'react'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import DropdownMenuItem from '../../models/DropdownMenuItem'
import { Link } from 'react-router-dom'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Dropdown({
  menuButton,
  menuItems,
  direction = 'right',
  ...props
}: {
  menuButton: ReactNode
  menuItems: DropdownMenuItem[]
  direction?: 'left' | 'right'
}) {
  function renderMenuItems() {
    return menuItems.map((item, idx) => {
      return <Menu.Item key={idx}>{({ active }) => renderLinkOrButton(active, item)}</Menu.Item>
    })
  }

  function renderLinkOrButton(active: boolean, item: DropdownMenuItem) {
    if (item.href) {
      return (
        <Link
          to={item.href}
          className={classNames(
            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
            'block px-4 py-2 text-sm cursor-pointer',
          )}
        >
          {item.label}
        </Link>
      )
    }
    return (
      <button
        onClick={item.action}
        className={classNames(
          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
          'block px-4 py-2 text-sm cursor-pointer w-full text-left',
        )}
      >
        {item.label}
      </button>
    )
  }

  return (
    <Menu as="div" className="z-10 relative inline-block text-left">
      <div>
        <Menu.Button>{menuButton}</Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`${direction === "left" ? "origin-top-left left-0" : "origin-top-right right-0"} absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
        >
          <div className="py-1">{renderMenuItems()}</div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
