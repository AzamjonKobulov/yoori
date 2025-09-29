import {
  Button,
  UserActionsDropdown,
  ImportUsers,
  AddNewUser,
  UserCard,
} from "../components";
import { useState } from "react";
import TablePagination from "../components/ui/TablePagination";
import { AnimatePresence, motion } from "framer-motion";
import ToastSuccess from "../components/ui/ToastSuccess";

interface UserRow {
  id: string;
  name: string;
  status: string;
  lastLogin: string;
  createdOffers: number;
  avatar: string;
  lastName?: string;
  firstName?: string;
  middleName?: string;
  email?: string;
  role?: string;
  password?: string;
}

interface ImportedUser {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  avatar: string;
}

// Sample user data
const initialTableData: UserRow[] = [
  {
    id: "1",
    name: "Иванов Иван Иванович",
    status: "Активен",
    lastLogin: "11.07.2023, 23:34",
    createdOffers: 124,
    avatar: "/assets/images/avatar.png",
    lastName: "Иванов",
    firstName: "Иван",
    middleName: "Иванович",
    email: "ivan@yandex.ru",
    role: "Менеджер по продажам",
    password: "password123",
  },
  {
    id: "2",
    name: "Петрова Анна Сергеевна",
    status: "Активен",
    lastLogin: "14.12.2024 09:15",
    createdOffers: 8,
    avatar: "/assets/images/avatar.png",
    lastName: "Петрова",
    firstName: "Анна",
    middleName: "Сергеевна",
    email: "anna.petrova@company.com",
    role: "Администратор",
    password: "admin456",
  },
  {
    id: "3",
    name: "Сидоров Петр Александрович",
    status: "Заблокирован",
    lastLogin: "10.12.2024 16:45",
    createdOffers: 3,
    avatar: "/assets/images/avatar.png",
    lastName: "Сидоров",
    firstName: "Петр",
    middleName: "Александрович",
    email: "petr.sidorov@company.com",
    role: "Пользователь",
    password: "user789",
  },
  {
    id: "4",
    name: "Козлова Мария Дмитриевна",
    status: "Активен",
    lastLogin: "15.12.2024 11:20",
    createdOffers: 15,
    avatar: "/assets/images/avatar.png",
    lastName: "Козлова",
    firstName: "Мария",
    middleName: "Дмитриевна",
    email: "maria.kozlova@company.com",
    role: "Менеджер",
    password: "manager101",
  },
  {
    id: "5",
    name: "Морозов Алексей Владимирович",
    status: "Активен",
    lastLogin: "13.12.2024 13:10",
    createdOffers: 6,
    avatar: "/assets/images/avatar.png",
    lastName: "Морозов",
    firstName: "Алексей",
    middleName: "Владимирович",
    email: "alexey.morozov@company.com",
    role: "Пользователь",
    password: "alexey2024",
  },
];

export default function Users() {
  const [data, setData] = useState(initialTableData);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastTitle, setToastTitle] = useState("Изменения сохранены");
  const [toastText, setToastText] = useState("Пользователь обновлен!");
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showUserCard, setShowUserCard] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Function to get status color based on status
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Активен":
        return "bg-teal-500";
      case "Заблокирован":
        return "bg-red-500";
      default:
        return "bg-neutral-500";
    }
  };

  const handleSelectAll = () => {
    setSelectedRows((prev) =>
      prev.size === filteredData.length
        ? new Set()
        : new Set(filteredData.map((row) => row.id))
    );
  };

  const handleRowSelect = (rowId: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  };

  const handleAddUser = () => {
    setIsEditing(false);
    setEditingUser(null);
    setShowAddUserModal(true);
  };

  const handleAddUserConfirm = (userData: {
    lastName: string;
    firstName: string;
    middleName: string;
    email: string;
    role: string;
    avatar: string;
    password?: string;
  }) => {
    // Create full name from parts
    const fullName =
      `${userData.lastName} ${userData.firstName} ${userData.middleName}`.trim();

    if (isEditing && editingUser) {
      // Editing existing user
      const updatedUser: UserRow = {
        ...editingUser,
        name: fullName,
        avatar: userData.avatar,
        lastName: userData.lastName,
        firstName: userData.firstName,
        middleName: userData.middleName,
        email: userData.email,
        role: userData.role,
        password: userData.password || editingUser.password,
      };

      // Update user in the data
      setData((prev) =>
        prev.map((user) => (user.id === editingUser.id ? updatedUser : user))
      );

      // Show success toast
      setToastTitle("Пользователь обновлен");
      setToastText("Данные пользователя успешно обновлены!");
      setShowToast(true);
    } else {
      // Adding new user
      const newUser: UserRow = {
        id: `user-${Date.now()}`,
        name: fullName,
        status: "Активен",
        lastLogin: "Не входил",
        createdOffers: 0,
        avatar: userData.avatar,
        lastName: userData.lastName,
        firstName: userData.firstName,
        middleName: userData.middleName,
        email: userData.email,
        role: userData.role,
        password: userData.password || "defaultPassword123",
      };

      // Add new user to the existing data
      setData((prev) => [newUser, ...prev]);

      // Show success toast
      setToastTitle("Пользователь добавлен");
      setToastText("Новый пользователь успешно добавлен!");
      setShowToast(true);
    }

    // Auto-hide toast after 3 seconds
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleImportUsers = () => {
    setShowImportModal(true);
  };

  const handleImportUsersConfirm = (importedUsers: ImportedUser[]) => {
    // Convert imported users to UserRow format
    const newUsers: UserRow[] = importedUsers.map((user, index) => ({
      id: `imported-${user.id}-${Date.now()}-${index}`, // Unique ID for imported users
      name: user.name,
      status: "Активен", // Default status for imported users
      lastLogin: "Не входил", // Default for new users
      createdOffers: 0, // Default for new users
      avatar: user.avatar,
    }));

    // Add new users to the existing data
    setData((prev) => [...newUsers, ...prev]);

    // Show success toast
    setToastTitle("Пользователи добавлены");
    setToastText(`${newUsers.length} пользователей добавлено`);
    setShowToast(true);

    // Auto-hide toast after 3 seconds
    setTimeout(() => setShowToast(false), 3000);

    console.log("Imported users:", newUsers);
  };

  const handleUserClick = (user: UserRow) => {
    setSelectedUser(user);
    setShowUserCard(true);
  };

  const handleUserEdit = (user: UserRow | null) => {
    if (!user) return;
    // Set the user data for editing and open the modal
    setEditingUser(user);
    setIsEditing(true);
    setShowAddUserModal(true);
  };

  const handleUserDelete = (user: UserRow | null) => {
    if (!user) return;
    // Remove user from data
    setData((prev) => prev.filter((u) => u.id !== user.id));

    // Show success toast
    setToastTitle("Пользователь удален");
    setToastText("Пользователь успешно удален!");
    setShowToast(true);

    // Auto-hide toast after 3 seconds
    setTimeout(() => setShowToast(false), 3000);

    console.log("Deleted user:", user);
  };

  // Filter data based on search term
  const filteredData = data.filter((row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-medium">Список пользователей</h1>
        <div className="w-max flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative max-w-84 w-full">
            <label htmlFor="search" className="absolute left-3 top-2.5">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.0001 14L11.1335 11.1333M12.6667 7.33333C12.6667 10.2789 10.2789 12.6667 7.33333 12.6667C4.38781 12.6667 2 10.2789 2 7.33333C2 4.38781 4.38781 2 7.33333 2C10.2789 2 12.6667 4.38781 12.6667 7.33333Z"
                  stroke="#71717A"
                  strokeWidth="1.33"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </label>

            <input
              type="text"
              name=""
              id="search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              placeholder="Поиск по ФИО"
              className="w-84 h-9 text-sm bg-white border border-base-border rounded-md outline-none shadow-outline focus:ring-2 ring-base-border pl-9"
            />
          </div>

          <Button variant="primary" onClick={handleAddUser}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.33301 7.99998H12.6663M7.99967 3.33331V12.6666"
                stroke="#FAFAFA"
                strokeWidth="1.33"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Добавить пользователя
          </Button>

          {/* User Actions Dropdown */}
          <UserActionsDropdown onImportUsers={handleImportUsers} />
        </div>
      </div>

      <div className="h-[calc(100vh-96px)] overflow-y-auto relative flex flex-col justify-between space-y-4 bg-white border border-base-border rounded-md mt-5 px-5 pb-5 pt-4">
        <div className="space-y-4">
          <div className="text-sm font-medium">
            Всего:{" "}
            <span className="text-base-muted-foreground">
              {filteredData.length}
            </span>
          </div>

          <table className="table table-auto w-full text-sm/5 text-left border-y border-base-border">
            <thead className="text-base-muted-foreground">
              <tr className="h-10 bg-base-blue-100 border-b border-base-border divide-x divide-base-border">
                <th className="w-[5%] font-medium pl-2 py-2.5">
                  <div className="flex items-center gap-5.5">
                    <div>
                      <input
                        type="checkbox"
                        id="check-all"
                        className="peer hidden"
                        checked={
                          selectedRows.size === paginatedData.length &&
                          paginatedData.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                      <label
                        htmlFor="check-all"
                        className="size-4 flex-center border border-base-foreground rounded-[2px] peer-checked:bg-base-chart-1 peer-checked:border-base-chart-1 shadow-primary"
                      >
                        <svg
                          width="12"
                          height="9"
                          viewBox="0 0 12 9"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.3346 1L4.0013 8.33333L0.667969 5"
                            stroke="#FAFAFA"
                            strokeWidth="1.33"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </label>
                    </div>
                    <div>Фото</div>
                  </div>
                </th>
                <th className="w-1/4 font-medium px-3.5">ФИО</th>
                <th className="w-[8%] font-medium px-3.5">Статус</th>
                <th className="w-[12%] font-medium px-3.5">Последний вход</th>
                <th className="w-[20%] font-medium px-3.5">
                  Кол-во созданных КП
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-base-border divide-x divide-base-border"
                >
                  <td className="w-[5%] pl-2">
                    <div className="flex items-center gap-5.5">
                      <div>
                        <input
                          type="checkbox"
                          id={`check-${row.id}`}
                          className="peer hidden"
                          checked={selectedRows.has(row.id)}
                          onChange={() => handleRowSelect(row.id)}
                        />
                        <label
                          htmlFor={`check-${row.id}`}
                          className="size-4 flex-center border border-base-foreground rounded-[2px] peer-checked:bg-base-chart-1 peer-checked:border-base-chart-1 shadow-primary"
                        >
                          <svg
                            width="12"
                            height="9"
                            viewBox="0 0 12 9"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.3346 1L4.0013 8.33333L0.667969 5"
                              stroke="#FAFAFA"
                              strokeWidth="1.33"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </label>
                      </div>
                      <img
                        src={row.avatar}
                        alt={row.name}
                        className="size-10 shrink-0 rounded-md object-cover"
                      />
                    </div>
                  </td>
                  <td className="flex items-center gap-4 font-medium py-4 pl-2">
                    <button
                      onClick={() => handleUserClick(row)}
                      className="line-clamp-1 pl-1.5 text-base-chart-1 hover:underline cursor-pointer text-left"
                    >
                      {row.name}
                    </button>
                  </td>
                  <td className="w-[8%] px-3.5">
                    <span
                      className={`font-semibold text-xs/4 text-white ${getStatusColor(
                        row.status
                      )} rounded-md shadow-primary py-0.5 px-2.5`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="w-[12%] px-3.5">{row.lastLogin}</td>
                  <td className="w-[20%] px-3.5">{row.createdOffers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      </div>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ x: 48, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 48, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed top-2.5 right-2.5 z-[60]"
          >
            <ToastSuccess title={toastTitle} text={toastText} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Import Users Modal */}
      <ImportUsers
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportUsersConfirm}
      />

      {/* Add New User Modal */}
      <AddNewUser
        isOpen={showAddUserModal}
        onClose={() => {
          setShowAddUserModal(false);
          setIsEditing(false);
          setEditingUser(null);
        }}
        onAddUser={handleAddUserConfirm}
        initialData={
          editingUser
            ? {
                id: editingUser.id,
                lastName: editingUser.lastName || "",
                firstName: editingUser.firstName || "",
                middleName: editingUser.middleName || "",
                email: editingUser.email || "",
                role: editingUser.role || "",
                avatar: editingUser.avatar,
                status: editingUser.status,
                password: editingUser.password || "",
              }
            : undefined
        }
        isEditing={isEditing}
      />

      {/* User Card Modal */}
      <UserCard
        isOpen={showUserCard}
        onClose={() => {
          setShowUserCard(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onEdit={handleUserEdit}
        onDelete={handleUserDelete}
      />
    </div>
  );
}
