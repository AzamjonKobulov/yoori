import { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Button, DeleteConfirmation, CoverDisplayInfo } from "../components";

interface UploadedImage {
  file: File;
  preview: string;
}

export default function Graphics() {
  const [logoImage, setLogoImage] = useState<UploadedImage | null>(null);
  const [coverImage, setCoverImage] = useState<UploadedImage | null>(null);
  const [showDeleteCoverModal, setShowDeleteCoverModal] = useState(false);
  const [showDeleteLogoModal, setShowDeleteLogoModal] = useState(false);
  const [showCoverDisplayInfoModal, setShowCoverDisplayInfoModal] =
    useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setImage: (image: UploadedImage | null) => void
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/png", "image/jpeg", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      alert("Пожалуйста, выберите файл в формате PNG, JPEG или GIF");
      return;
    }

    // Validate file size (10MB = 10 * 1024 * 1024 bytes)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("Размер файла не должен превышать 10МБ");
      return;
    }

    // Create preview URL
    const preview = URL.createObjectURL(file);
    setImage({ file, preview });
  };

  const handleDeleteCover = () => {
    setCoverImage(null);
  };

  const handleDeleteLogo = () => {
    setLogoImage(null);
  };

  const handleUploadClick = (
    inputRef: React.RefObject<HTMLInputElement | null>
  ) => {
    inputRef.current?.click();
  };
  return (
    <div className="space-y-5 p-5">
      <div className="space-y-6.5 bg-white border border-base-border rounded-md p-5">
        <div className="flex-between">
          <h2 className="text-xl/7 font-medium">Логотип компании</h2>

          <Button
            variant="ghost"
            className="flex items-center gap-2 text-base-chart-1 text-xs/4 py-2 px-3"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_2260_15030)">
                <path
                  d="M8.00004 10.6666V7.99996M8.00004 5.33329H8.00671M2.56667 5.74669C2.46937 5.30837 2.48431 4.85259 2.61011 4.42158C2.73591 3.99058 2.9685 3.59832 3.28632 3.28117C3.60413 2.96402 3.99688 2.73225 4.42814 2.60735C4.85941 2.48245 5.31523 2.46847 5.75334 2.56669C5.99448 2.18956 6.32668 1.8792 6.71931 1.66421C7.11194 1.44923 7.55237 1.33655 8.00001 1.33655C8.44764 1.33655 8.88807 1.44923 9.28071 1.66421C9.67334 1.8792 10.0055 2.18956 10.2467 2.56669C10.6855 2.46804 11.1421 2.48196 11.574 2.60717C12.006 2.73237 12.3992 2.96478 12.7172 3.28279C13.0352 3.6008 13.2677 3.99407 13.3929 4.42603C13.5181 4.85798 13.532 5.31458 13.4333 5.75336C13.8105 5.9945 14.1208 6.32669 14.3358 6.71932C14.5508 7.11196 14.6635 7.55239 14.6635 8.00002C14.6635 8.44766 14.5508 8.88809 14.3358 9.28072C14.1208 9.67335 13.8105 10.0056 13.4333 10.2467C13.5316 10.6848 13.5176 11.1406 13.3927 11.5719C13.2678 12.0032 13.036 12.3959 12.7189 12.7137C12.4017 13.0315 12.0094 13.2641 11.5784 13.3899C11.1474 13.5157 10.6917 13.5307 10.2533 13.4334C10.0125 13.8119 9.68006 14.1236 9.28676 14.3396C8.89346 14.5555 8.45202 14.6687 8.00334 14.6687C7.55466 14.6687 7.11322 14.5555 6.71992 14.3396C6.32662 14.1236 5.99417 13.8119 5.75334 13.4334C5.31523 13.5316 4.85941 13.5176 4.42814 13.3927C3.99688 13.2678 3.60413 13.036 3.28632 12.7189C2.9685 12.4017 2.73591 12.0095 2.61011 11.5785C2.48431 11.1475 2.46937 10.6917 2.56667 10.2534C2.18664 10.0129 1.87362 9.68014 1.65671 9.28617C1.4398 8.89219 1.32605 8.44976 1.32605 8.00002C1.32605 7.55029 1.4398 7.10785 1.65671 6.71388C1.87362 6.31991 2.18664 5.9872 2.56667 5.74669Z"
                  stroke="#8942FE"
                  stroke-width="1.33"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_2260_15030">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            Где отображается обложка
          </Button>
        </div>

        <div className="space-y-4">
          <p className="text-sm/5 font-medium text-base-muted-foreground">
            Логотип будет отображаться в карточке компании
          </p>

          <div className="flex gap-4">
            <div className="size-18 shrink-0 bg-black/5 flex-center border border-base-border rounded-md overflow-hidden">
              {logoImage ? (
                <img
                  src={logoImage.preview}
                  alt="Company logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.0014 8H15.0114M12.5014 21H6.00137C5.20572 21 4.44266 20.6839 3.88005 20.1213C3.31744 19.5587 3.00137 18.7956 3.00137 18V6C3.00137 5.20435 3.31744 4.44129 3.88005 3.87868C4.44266 3.31607 5.20572 3 6.00137 3H18.0014C18.797 3 19.5601 3.31607 20.1227 3.87868C20.6853 4.44129 21.0014 5.20435 21.0014 6V12.5M3.00137 16L8.00137 11C8.92937 10.107 10.0734 10.107 11.0014 11L14.5014 14.5M14.0014 14L15.0014 13C15.6804 12.347 16.4744 12.171 17.2154 12.474M19.0014 22V16M19.0014 16L22.0014 19M19.0014 16L16.0014 19"
                    stroke="#B3B3B3"
                    stroke-width="1.66"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => handleUploadClick(logoInputRef)}
                >
                  {logoImage ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.00146 8C2.00146 6.4087 2.63361 4.88258 3.75882 3.75736C4.88404 2.63214 6.41017 2 8.00147 2C9.67883 2.00631 11.2888 2.66082 12.4948 3.82667L14.0015 5.33333M14.0015 5.33333V2M14.0015 5.33333H10.6681M14.0015 8C14.0015 9.5913 13.3693 11.1174 12.2441 12.2426C11.1189 13.3679 9.59276 14 8.00147 14C6.3241 13.9937 4.71411 13.3392 3.50813 12.1733L2.00146 10.6667M2.00146 10.6667H5.3348M2.00146 10.6667V14"
                        stroke="#18181B"
                        stroke-width="1.33"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.0014 10V12.6667C14.0014 13.0203 13.8609 13.3594 13.6108 13.6095C13.3608 13.8595 13.0217 14 12.668 14H3.33471C2.98108 14 2.64195 13.8595 2.3919 13.6095C2.14185 13.3594 2.00137 13.0203 2.00137 12.6667V10M11.3347 5.33333L8.00137 2M8.00137 2L4.66804 5.33333M8.00137 2V10"
                        stroke="#18181B"
                        stroke-width="1.33"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  )}
                  {logoImage ? "Заменить" : "Загрузить"}
                </Button>
                <Button
                  variant="outline"
                  className={`flex items-center gap-2 disabled:opacity-50 ${
                    logoImage
                      ? " text-base-destructive hover:bg-base-destructive/10"
                      : ""
                  }`}
                  disabled={!logoImage}
                  onClick={() => setShowDeleteLogoModal(true)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.00137 3.99999H14.0014M12.668 3.99999V13.3333C12.668 14 12.0014 14.6667 11.3347 14.6667H4.66804C4.00137 14.6667 3.33471 14 3.33471 13.3333V3.99999M5.33471 3.99999V2.66666C5.33471 1.99999 6.00137 1.33333 6.66804 1.33333H9.33471C10.0014 1.33333 10.668 1.99999 10.668 2.66666V3.99999M6.66804 7.33333V11.3333M9.33471 7.33333V11.3333"
                      stroke={logoImage ? "#dc2626" : "#18181B"}
                      stroke-width="1.33"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Удалить
                </Button>
              </div>
              <p className="text-xs/[140%] text-base-gray-light">
                Мы поддерживаем PNG, JPEG и GIF файлы размером до 10МБ
              </p>
            </div>
          </div>
        </div>

        {/* Hidden file input for logo */}
        <input
          ref={logoInputRef}
          type="file"
          accept="image/png,image/jpeg,image/gif"
          className="hidden"
          onChange={(e) => handleImageUpload(e, setLogoImage)}
        />
      </div>
      <div className="space-y-6.5 bg-white border border-base-border rounded-md p-5">
        <div className="flex-between">
          <h2 className="text-xl/7 font-medium">Обложка публичного КП</h2>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-base-chart-1 text-xs/4 py-2 px-3"
              onClick={() => setShowCoverDisplayInfoModal(true)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_2260_15030)">
                  <path
                    d="M8.00004 10.6666V7.99996M8.00004 5.33329H8.00671M2.56667 5.74669C2.46937 5.30837 2.48431 4.85259 2.61011 4.42158C2.73591 3.99058 2.9685 3.59832 3.28632 3.28117C3.60413 2.96402 3.99688 2.73225 4.42814 2.60735C4.85941 2.48245 5.31523 2.46847 5.75334 2.56669C5.99448 2.18956 6.32668 1.8792 6.71931 1.66421C7.11194 1.44923 7.55237 1.33655 8.00001 1.33655C8.44764 1.33655 8.88807 1.44923 9.28071 1.66421C9.67334 1.8792 10.0055 2.18956 10.2467 2.56669C10.6855 2.46804 11.1421 2.48196 11.574 2.60717C12.006 2.73237 12.3992 2.96478 12.7172 3.28279C13.0352 3.6008 13.2677 3.99407 13.3929 4.42603C13.5181 4.85798 13.532 5.31458 13.4333 5.75336C13.8105 5.9945 14.1208 6.32669 14.3358 6.71932C14.5508 7.11196 14.6635 7.55239 14.6635 8.00002C14.6635 8.44766 14.5508 8.88809 14.3358 9.28072C14.1208 9.67335 13.8105 10.0056 13.4333 10.2467C13.5316 10.6848 13.5176 11.1406 13.3927 11.5719C13.2678 12.0032 13.036 12.3959 12.7189 12.7137C12.4017 13.0315 12.0094 13.2641 11.5784 13.3899C11.1474 13.5157 10.6917 13.5307 10.2533 13.4334C10.0125 13.8119 9.68006 14.1236 9.28676 14.3396C8.89346 14.5555 8.45202 14.6687 8.00334 14.6687C7.55466 14.6687 7.11322 14.5555 6.71992 14.3396C6.32662 14.1236 5.99417 13.8119 5.75334 13.4334C5.31523 13.5316 4.85941 13.5176 4.42814 13.3927C3.99688 13.2678 3.60413 13.036 3.28632 12.7189C2.9685 12.4017 2.73591 12.0095 2.61011 11.5785C2.48431 11.1475 2.46937 10.6917 2.56667 10.2534C2.18664 10.0129 1.87362 9.68014 1.65671 9.28617C1.4398 8.89219 1.32605 8.44976 1.32605 8.00002C1.32605 7.55029 1.4398 7.10785 1.65671 6.71388C1.87362 6.31991 2.18664 5.9872 2.56667 5.74669Z"
                    stroke="#8942FE"
                    stroke-width="1.33"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2260_15030">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Где отображается обложка
            </Button>
            {/* When cover image is set */}
            {coverImage && (
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => handleUploadClick(coverInputRef)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 8C2 6.4087 2.63214 4.88258 3.75736 3.75736C4.88258 2.63214 6.4087 2 8 2C9.67737 2.00631 11.2874 2.66082 12.4933 3.82667L14 5.33333M14 5.33333V2M14 5.33333H10.6667M14 8C14 9.5913 13.3679 11.1174 12.2426 12.2426C11.1174 13.3679 9.5913 14 8 14C6.32263 13.9937 4.71265 13.3392 3.50667 12.1733L2 10.6667M2 10.6667H5.33333M2 10.6667V14"
                    stroke="#18181B"
                    stroke-width="1.33"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Заменить обложку
              </Button>
            )}
            {/* When cover image is set */}
            {coverImage && (
              <Button
                variant="outline"
                className="flex items-center gap-2 text-base-destructive hover:bg-base-destructive/10"
                onClick={() => setShowDeleteCoverModal(true)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 3.99992H14M12.6667 3.99992V13.3333C12.6667 13.9999 12 14.6666 11.3333 14.6666H4.66667C4 14.6666 3.33333 13.9999 3.33333 13.3333V3.99992M5.33333 3.99992V2.66659C5.33333 1.99992 6 1.33325 6.66667 1.33325H9.33333C10 1.33325 10.6667 1.99992 10.6667 2.66659V3.99992M6.66667 7.33325V11.3333M9.33333 7.33325V11.3333"
                    stroke="#DC2626"
                    stroke-width="1.33"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Удалить обложку
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm/5 text-base-muted-foreground font-medium">
            Обложка будет отображаться при публикации публичной версии КП
          </p>

          <div className="h-59 w-full bg-black/5 flex flex-col items-center justify-center gap-6 border border-base-border rounded-md relative overflow-hidden">
            {coverImage ? (
              <img
                src={coverImage.preview}
                alt="Cover preview"
                className="size-full object-cover"
              />
            ) : (
              <>
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.0007 8.5H15.0107M12.5007 21.5H6.00073C5.20508 21.5 4.44202 21.1839 3.87941 20.6213C3.3168 20.0587 3.00073 19.2956 3.00073 18.5V6.5C3.00073 5.70435 3.3168 4.94129 3.87941 4.37868C4.44202 3.81607 5.20508 3.5 6.00073 3.5H18.0007C18.7964 3.5 19.5594 3.81607 20.1221 4.37868C20.6847 4.94129 21.0007 5.70435 21.0007 6.5V13M3.00073 16.5L8.00073 11.5C8.92873 10.607 10.0727 10.607 11.0007 11.5L14.5007 15M14.0007 14.5L15.0007 13.5C15.6797 12.847 16.4737 12.671 17.2147 12.974M19.0007 22.5V16.5M19.0007 16.5L22.0007 19.5M19.0007 16.5L16.0007 19.5"
                    stroke="#B3B3B3"
                    stroke-width="1.66"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => handleUploadClick(coverInputRef)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.0014 10V12.6667C14.0014 13.0203 13.8609 13.3594 13.6108 13.6095C13.3608 13.8595 13.0217 14 12.668 14H3.33471C2.98108 14 2.64195 13.8595 2.3919 13.6095C2.14185 13.3594 2.00137 13.0203 2.00137 12.6667V10M11.3347 5.33333L8.00137 2M8.00137 2L4.66804 5.33333M8.00137 2V10"
                      stroke="#18181B"
                      stroke-width="1.33"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Загрузить
                </Button>

                <p className="text-xs/[140%] text-base-gray-light">
                  Мы поддерживаем PNG, JPEG и GIF файлы размером до 10МБ
                </p>
              </>
            )}
          </div>
        </div>

        {/* Hidden file input for cover */}
        <input
          ref={coverInputRef}
          type="file"
          accept="image/png,image/jpeg,image/gif"
          className="hidden"
          onChange={(e) => handleImageUpload(e, setCoverImage)}
        />
      </div>

      {/* Delete Cover Confirmation Modal */}
      <AnimatePresence>
        {showDeleteCoverModal && (
          <DeleteConfirmation
            onClose={() => setShowDeleteCoverModal(false)}
            onConfirm={handleDeleteCover}
            title="Удалить обложку?"
            message="Текст о том, что обложка круто повышает конверсию публичного КП и не стоит ее удалять"
            confirmText="Удалить"
            cancelText="Отмена"
          />
        )}
      </AnimatePresence>

      {/* Delete Logo Confirmation Modal */}
      <AnimatePresence>
        {showDeleteLogoModal && (
          <DeleteConfirmation
            onClose={() => setShowDeleteLogoModal(false)}
            onConfirm={handleDeleteLogo}
            title="Удалить логотип?"
            message="Логотип компании отображается в карточке компании и помогает клиентам узнавать ваш бренд"
            confirmText="Удалить"
            cancelText="Отмена"
          />
        )}

        {/* Cover Display Info Modal */}
        <CoverDisplayInfo
          isOpen={showCoverDisplayInfoModal}
          onClose={() => setShowCoverDisplayInfoModal(false)}
        />
      </AnimatePresence>
    </div>
  );
}
