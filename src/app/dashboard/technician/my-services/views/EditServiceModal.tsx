'use client';

import React, { useState, useEffect } from 'react';
import { Service, ServiceCategory, ServiceMode } from '@/types';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import { X, Camera, DollarSign, Clock, MapPin, Tag, FileText, Save, AlertCircle } from 'lucide-react';

interface Props {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES: ServiceCategory[] = [
  'Smartphone',
  'Laptop & PC',
  'AC',
  'Refrigerator',
  'TV',
  'Washing Machine',
  'Electrical',
];

const SERVICE_MODES: ServiceMode[] = ['Home Visit', 'Shop Drop-off'];

export default function EditServiceModal({
  service,
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('Smartphone');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState<string>('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [serviceMode, setServiceMode] = useState<ServiceMode>('Home Visit');
  const [serviceArea, setServiceArea] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (service) {
      setTitle(service.title);
      setCategory(service.category);
      setDescription(service.description);
      setBasePrice(String(service.basePrice));
      setEstimatedDuration(service.estimatedDuration);
      setServiceMode(service.serviceMode);
      setServiceArea(service.serviceArea);
      setImageUrl(service.image);
    }
  }, [service]);

  if (!isOpen || !service) return null;

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const uploadRes = await apiFetch<{ success: boolean; url: string }>('/upload', {
          method: 'POST',
          body: JSON.stringify({ image: base64Data }),
        });

        if (uploadRes.success && uploadRes.url) {
          setImageUrl(uploadRes.url);
          toast.success('Updated image uploaded to ImgBB!');
        }
      } catch (err: any) {
        toast.error('Image upload failed');
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const priceNum = parseFloat(basePrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Base price must be a positive number');
      return;
    }

    setSaving(true);
    try {
      const res = await apiFetch<{ success: boolean; message: string }>(
        `/services/${service._id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            title: title.trim(),
            category,
            description: description.trim(),
            basePrice: priceNum,
            estimatedDuration: estimatedDuration.trim(),
            serviceMode,
            serviceArea: serviceArea.trim(),
            image: imageUrl,
          }),
        }
      );

      if (res.success) {
        toast.success('Service updated and resubmitted for admin approval!');
        onSuccess();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update service');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Edit Service Listing</h3>
            <p className="text-xs text-amber-600 font-semibold mt-0.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Editing will return approvalStatus to 'pending' for moderation.</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Image */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Banner Image
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
              </div>
              <label className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors">
                <Camera className="w-3.5 h-3.5 inline mr-1.5" />
                <span>{uploadingImage ? 'Uploading...' : 'Replace Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Service Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Service Mode
              </label>
              <select
                value={serviceMode}
                onChange={(e) => setServiceMode(e.target.value as ServiceMode)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
              >
                {SERVICE_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Base Price (USD)
              </label>
              <input
                type="number"
                min="1"
                step="any"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                required
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Estimated Duration
              </label>
              <input
                type="text"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                required
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Coverage Area
              </label>
              <input
                type="text"
                value={serviceArea}
                onChange={(e) => setServiceArea(e.target.value)}
                required
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              {saving ? 'Updating...' : 'Save & Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
