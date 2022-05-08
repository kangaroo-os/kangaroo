/* This example requires Tailwind CSS v2.0+ */
import React from 'react'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import DropdownMenuItem from '../../models/DropdownMenuItem'
import { Link } from 'react-router-dom'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Dropdown({ menuButtonText, menuItems, ...props }: 
  {menuButtonText: string, menuItems: DropdownMenuItem[] }) {
  function renderMenuItems() {
    return menuItems.map((item, idx) => {
      return (
        <Menu.Item key={idx} >
          {({ active }) => (
            <Link
              onClick={item.action}
              to={item.href}
              className={classNames(
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'block px-4 py-2 text-sm cursor-pointer',
              )}
            >
              {item.label}
            </Link>
          )}
        </Menu.Item>
      )
    })
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button>
          {menuButtonText}
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5 inline-block" aria-hidden="true" />
        </Menu.Button>
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
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">{renderMenuItems()}</div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
