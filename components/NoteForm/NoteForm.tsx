'use client';

import { ChangeEvent, FormEvent, useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api/api";
import { DraftNote } from "@/types/note";
import { useRouter } from "next/navigation";
import { useNoteDraft } from "@/lib/store/noteStore";
// import * as Yup from "yup";

import css from "./NoteForm.module.css";
// interface NoteFormProps {
//   onSuccess: () => void;
//   onCancel: () => void;
// }

// const NoteSchema = Yup.object().shape({
//   title: Yup.string()
//     .min(3, "Мінімум 3 символи")
//     .max(50, "Максимум 50 символів")
//     .required("Обов'язкове поле"),
//   content: Yup.string().max(500, "Максимум 500 символів"),
//   tag: Yup.string()
//     .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
//     .required("Обов'язкове поле"),
// });

export default function NoteForm() {
  const isId = useId();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteDraft();

  const handleClose = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/notes/filter/all");
  };

  const { mutate: addNote, isPending } = useMutation({
    mutationFn: (contentText: DraftNote) => createNote(contentText),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
      clearDraft();
      if (window.history.length > 1) {
        router.back();
        return;
      }
      router.push("/notes/filter/all");
    },
  });

  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDraft({ ...draft, [name]: value });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData) as unknown as DraftNote;

    addNote(data);
  };

  return (
      <form className={css.form} onSubmit={handleSubmit}>
        <div className={css.formGroup}>
          <label htmlFor={`${isId}-title`}>Title</label>
          <input
            id={`${isId}-title`}
            type="text"
            name="title"
            className={css.input}
            onChange={handleChange}
            value={draft.title}
            required
          />
          {/* <ErrorMessage name="title" component="p" className={css.error} /> */}
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${isId}-content`}>Content</label>
          <textarea
            id={`${isId}-content`}
            name="content"
            rows={8}
            className={css.textarea}
            onChange={handleChange}
            value={draft.content}
          />
          {/* <ErrorMessage name="content" component="p" className={css.error} /> */}
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${isId}-tag`}>Tag</label>
          <select
            id={`${isId}-tag`}
            name="tag"
            className={css.select}
            onChange={handleChange}
            value={draft.tag}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </select>
          {/* <ErrorMessage name="tag" component="p" className={css.error} /> */}
        </div>

        <div className={css.actions}>
          <button
            onClick={handleClose}
            type="button"
            className={css.cancelButton}
          >
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={false}>
            {isPending ? "Creating.." : "Create note"}
          </button>
        </div>
      </form>
  );
}