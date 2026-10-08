import React, { useEffect, useState } from 'react';
import { Check, ChevronDown, FilePlus2, Plus, Save, X } from 'lucide-react';
import { ROLES } from './lib.js';

export function Button({ children, variant = 'primary', size = '', icon: Icon, className = '', type = 'button', disabled = false, onClick, ...rest }) {
  return <button type={type} className={`btn btn-${variant} ${size ? `btn-${size}` : ''} ${className}`} disabled={disabled} onClick={onClick} {...rest}>{Icon && <Icon size={16} strokeWidth={2} />}{children}</button>;
}

export function IconButton({ label, children, className = '', onClick, ...rest }) {
  return <button type="button" className={`icon-button ${className}`} aria-label={label} title={label} onClick={onClick} {...rest}>{children}</button>;
}

export function Badge({ children, tone = 'neutral', dot = false, className = '' }) {
  return <span className={`badge badge-${tone} ${className}`}>{dot && <i />}{children}</span>;
}

export function Avatar({ name, color = '', size = '' }) {
  const initials = String(name || 'M').trim().split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase() || 'M';
  const palette = ['lavender', 'mint', 'peach', 'sky', 'rose', 'gold'];
  const selected = color || palette[String(name || '').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % palette.length];
  return <span className={`avatar avatar-${selected} ${size ? `avatar-${size}` : ''}`}>{initials}</span>;
}

export function Modal({ title, subtitle, onClose, children, size = 'medium', className = '' }) {
  useEffect(() => {
    const handleEscape = (event) => event.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}>
    <section className={`modal modal-${size} ${className}`} role="dialog" aria-modal="true" aria-label={title}>
      <header className="modal-header">
        <div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
        <button className="modal-close" onClick={onClose} type="button" aria-label="Close"><X size={19} /></button>
      </header>
      {children}
    </section>
  </div>;
}

function normalizeChoices(choices) {
  return (choices || []).map((choice) => typeof choice === 'object' ? choice : ({ value: choice, label: choice }));
}

function FieldControl({ field, value, onChange, data, form, onUpload, onUploadState }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const label = field.label;
  const options = normalizeChoices(typeof field.options === 'function' ? field.options(form, data) : field.options);
  const inputProps = {
    id: field.name,
    name: field.name,
    required: field.required,
    placeholder: field.placeholder || '',
    disabled: field.disabled,
    autoComplete: field.autoComplete,
    'aria-label': label,
  };
  if (field.type === 'textarea') return <textarea {...inputProps} rows={field.rows || 3} value={value ?? ''} onChange={(event) => onChange(event.target.value)} />;
  if (field.type === 'select') return <div className="select-wrap"><select {...inputProps} value={value ?? ''} onChange={(event) => onChange(event.target.value)}><option value="">{field.placeholder || 'Select…'}</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><ChevronDown size={15} /></div>;
  if (field.type === 'multi') {
    const current = Array.isArray(value) ? value : [];
    return <div className={`multi-choice ${field.compact ? 'multi-choice-compact' : ''}`}>
      {options.length ? options.map((option) => <label key={option.value} className={`check-option ${current.includes(option.value) ? 'checked' : ''}`}><input type="checkbox" checked={current.includes(option.value)} onChange={(event) => onChange(event.target.checked ? [...current, option.value] : current.filter((entry) => entry !== option.value))} /><span className="fake-check"><Check size={11} /></span><span>{option.label}</span></label>) : <span className="muted small-text">No options yet</span>}
    </div>;
  }
  if (field.type === 'checklist') {
    const current = Array.isArray(value) ? value : [];
    const teamOptions = (data.team || []).map((person) => ({ value: person.id, label: person.name }));
    const updateItem = (index, key, nextValue) => onChange(current.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: nextValue } : item));
    return <div className="checklist-editor">
      {current.map((item, index) => <div className="checklist-edit-row" key={item.id || index}>
        <input type="checkbox" checked={Boolean(item.done)} onChange={(event) => updateItem(index, 'done', event.target.checked)} aria-label="Checklist item complete" />
        <input className="checklist-text" placeholder="Checklist item" value={item.text || ''} onChange={(event) => updateItem(index, 'text', event.target.value)} />
        {field.assignable !== false && <select aria-label="Assign checklist item" value={item.assignedTo || ''} onChange={(event) => updateItem(index, 'assignedTo', event.target.value)}><option value="">Unassigned</option>{teamOptions.map((person) => <option key={person.value} value={person.value}>{person.label}</option>)}</select>}
        <button type="button" className="remove-mini" aria-label="Remove checklist item" onClick={() => onChange(current.filter((_, itemIndex) => itemIndex !== index))}><X size={15} /></button>
      </div>)}
      <button type="button" className="add-checklist" onClick={() => onChange([...current, { text: '', done: false, ...(field.assignable === false ? {} : { assignedTo: '' }) }])}><Plus size={14} /> Add checklist item</button>
    </div>;
  }
  if (field.type === 'files') {
    const current = Array.isArray(value) ? value : [];
    const fileName = (file) => typeof file === 'string' ? file : file?.name || 'Attachment';
    const handleFiles = async (event) => {
      const selected = Array.from(event.target.files || []);
      event.target.value = '';
      if (!selected.length) return;
      setUploadError('');
      if (!onUpload) { onChange([...current, ...selected.map((file) => file.name)]); return; }
      setUploading(true);
      onUploadState?.(true);
      let updated = [...current];
      for (const file of selected) {
        try { const attachment = await onUpload(file); updated = [...updated, attachment]; onChange(updated); }
        catch (error) { setUploadError(error.message || `Could not upload ${file.name}.`); }
      }
      setUploading(false);
      onUploadState?.(false);
    };
    return <div className="file-input-wrap"><label className={`file-picker ${uploading ? 'is-uploading' : ''}`}><FilePlus2 size={16} /><span>{uploading ? 'Uploading securely…' : 'Upload attachment'}</span><input type="file" multiple disabled={uploading} onChange={handleFiles} /></label>{current.length > 0 && <div className="file-name-list">{current.map((file, index) => <span key={`${file?.id || file}-${index}`}>{file?.id ? <a href={`/api/files/${encodeURIComponent(file.id)}`} target="_blank" rel="noreferrer">{fileName(file)}</a> : fileName(file)}<button type="button" onClick={() => onChange(current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove ${fileName(file)}`}><X size={12} /></button></span>)}</div>}{uploadError && <small className="upload-error">{uploadError}</small>}<small>Manager-only file storage · 10 MB maximum per file. Executable file types are blocked.</small></div>;
  }
  if (field.type === 'progress') return <div className="progress-input"><input {...inputProps} type="range" min={0} max={100} step={5} value={Number(value || 0)} onChange={(event) => onChange(Number(event.target.value))} /><strong>{Number(value || 0)}%</strong></div>;
  const type = ['date', 'time', 'number', 'email', 'password'].includes(field.type) ? field.type : 'text';
  return <input {...inputProps} type={type} min={field.min} max={field.max} step={field.step} value={value ?? (type === 'number' ? '' : '')} onChange={(event) => onChange(type === 'number' ? (event.target.value === '' ? '' : Number(event.target.value)) : event.target.value)} />;
}

export function RecordForm({ title, subtitle, initial = {}, fields, data, onSave, onUpload, onClose, saveLabel = 'Save changes', extra, size = 'large', transform }) {
  const [form, setForm] = useState(() => ({ ...initial }));
  const [saving, setSaving] = useState(false);
  const [uploadsPending, setUploadsPending] = useState(false);
  const [error, setError] = useState('');
  const setField = (name, value) => setForm((current) => {
    const next = { ...current, [name]: value };
    if (name === 'department' && current.department !== value) next.role = (ROLES[value] || [])[0] || '';
    if (name === 'personId' && current.personId !== value) {
      const person = data.team?.find((entry) => entry.id === value);
      if (person) { next.department = person.department; next.role = person.role; }
    }
    if (name === 'targetType' && current.targetType !== value) next.targetId = '';
    return next;
  });
  const shownFields = fields.filter((field) => !field.when || field.when(form, data));
  let currentSection = '';
  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave(transform ? transform(form) : form);
      onClose();
    } catch (saveError) {
      setError(saveError.message || 'Unable to save this record.');
    } finally {
      setSaving(false);
    }
  }
  return <Modal title={title} subtitle={subtitle} onClose={onClose} size={size}>
    <form className="record-form" onSubmit={submit}>
      <div className="form-grid">
        {shownFields.map((field) => {
          const section = field.section || '';
          const showSection = section && section !== currentSection;
          currentSection = section;
          return <React.Fragment key={`${field.name}-${field.label}`}>{showSection && <div className="form-section-title">{section}</div>}<div className={`form-field ${field.wide ? 'field-wide' : ''} ${field.type === 'multi' || field.type === 'checklist' || field.type === 'files' || field.type === 'progress' ? 'field-special' : ''}`}><label className="field-label" htmlFor={field.name}>{field.label}{field.required && <i>*</i>}</label>{field.hint && <small className="field-hint">{field.hint}</small>}<FieldControl field={field} value={form[field.name]} form={form} data={data} onUpload={onUpload} onUploadState={setUploadsPending} onChange={(value) => setField(field.name, value)} /></div></React.Fragment>;
        })}
      </div>
      {typeof extra === 'function' ? extra(form, data) : extra}
      {error && <div className="form-error" role="alert">{error}</div>}
      <footer className="form-footer"><span className="form-privacy">Only Managers can view and update this record.</span><div><button type="button" className="btn btn-quiet" onClick={onClose}>Cancel</button><Button type="submit" icon={Save} disabled={saving || uploadsPending}>{saving ? 'Saving…' : uploadsPending ? 'Wait for uploads…' : saveLabel}</Button></div></footer>
    </form>
  </Modal>;
}

export function LoadingScreen({ label = 'Opening your workspace…' }) {
  return <div className="loading-screen"><div className="loading-mark"><span>∞</span></div><strong>{label}</strong><div className="loading-line"><i /></div></div>;
}
