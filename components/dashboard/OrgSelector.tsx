// components/dashboard/OrgSelector.tsx
// Organization Selector — Searchable dropdown for multi-client consultants
// Features: Search/filter, logo display, employee count, "Toate firmele" option
// Persists selection in URL and localStorage

'use client'

import { useState, Fragment } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { Building2, Check, ChevronsUpDown, Users } from 'lucide-react'
import { useOrg } from '@/lib/contexts/OrgContext'

export default function OrgSelector() {
  const { currentOrg, setCurrentOrg, allOrgs, selectedOrgData } = useOrg()
  const [query, setQuery] = useState('')

  // Filter organizations based on search query
  const filteredOrgs = query === ''
    ? allOrgs
    : allOrgs.filter((org) =>
        org.name.toLowerCase().includes(query.toLowerCase()) ||
        org.cui?.toLowerCase().includes(query.toLowerCase())
      )

  // Get display text for selected option
  const getDisplayText = () => {
    if (currentOrg === 'all') {
      return `Toate organizațiile (${allOrgs.length})`
    }
    if (selectedOrgData) {
      return selectedOrgData.name
    }
    return 'Selectează organizație'
  }

  return (
    <div className="w-full max-w-md">
      <Combobox value={currentOrg} onChange={setCurrentOrg}>
        <div className="relative">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-left shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2.5 pl-10 pr-10 text-sm leading-5 text-gray-900 dark:text-white bg-transparent focus:ring-0 placeholder:text-gray-400"
              displayValue={() => getDisplayText()}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Caută organizație..."
            />
            <Combobox.Button className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Building2 className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </Combobox.Button>
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronsUpDown
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute z-50 mt-1 max-h-80 w-full overflow-auto rounded-lg bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {/* "Toate organizațiile" option */}
              <Combobox.Option
                value="all"
                className={({ active }) =>
                  `relative cursor-pointer select-none py-3 pl-10 pr-4 ${
                    active ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`block truncate font-semibold ${selected ? 'font-bold' : ''}`}>
                          Toate organizațiile
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {allOrgs.length} {allOrgs.length === 1 ? 'organizație' : 'organizații'}
                        </span>
                      </div>
                    </div>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                        <Check className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>

              {/* Divider */}
              <div className="border-t border-gray-100 dark:border-gray-700 my-1" />

              {/* Organization options */}
              {filteredOrgs.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-3 px-4 text-gray-500 dark:text-gray-400 text-sm">
                  Nicio organizație găsită.
                </div>
              ) : (
                filteredOrgs.map((org) => (
                  <Combobox.Option
                    key={org.id}
                    value={org.id}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-3 pl-10 pr-4 ${
                        active ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {/* Logo if available */}
                              {org.logo_url ? (
                                <img
                                  src={org.logo_url}
                                  alt={org.name}
                                  className="h-6 w-6 rounded object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="h-6 w-6 rounded bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                                  <Building2 className="h-4 w-4 text-gray-400" />
                                </div>
                              )}
                              <span className={`block truncate ${selected ? 'font-bold' : 'font-medium'}`}>
                                {org.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                              {org.cui && <span>CUI: {org.cui}</span>}
                              {org.employee_count !== undefined && (
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {org.employee_count} {org.employee_count === 1 ? 'angajat' : 'angajați'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                            <Check className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  )
}
