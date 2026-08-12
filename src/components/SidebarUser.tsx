'use client'

interface SidebarUserProps {
  name: string
  role: string
  photo?: string | null
}

export default function SidebarUser({
  name,
  role,
  photo,
}: SidebarUserProps) {

  return (
    <div className="border-b border-[#F3DEC8] px-4 py-4">

      <div className="flex items-center gap-3">

        {/* Avatar */}

        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-50">

          {photo ? (
            <img
              src={photo}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-5 w-5 text-[#F58220]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="
                  M15.75 6a3.75 3.75 0 11-7.5 0
                  3.75 3.75 0 017.5 0z
                  M4.5 20.25a8.25 8.25 0
                  0115 0
                "
              />
            </svg>
          )}

        </div>

        {/* User Info */}

        <div className="min-w-0">

          <p className="truncate text-sm font-semibold text-gray-900">
            {name}
          </p>

          <p className="truncate text-xs text-gray-500">
            {role}
          </p>

        </div>

      </div>

    </div>
  )
}