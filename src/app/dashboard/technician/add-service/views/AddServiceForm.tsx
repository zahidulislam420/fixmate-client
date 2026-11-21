'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import {
  Wrench,
  Camera,
  DollarSign,
  Clock,
  MapPin,
  Tag,
  FileText,
  User,
  Mail,
  PlusCircle,
} from 'lucide-react';
import { ServiceCategory, ServiceMode } from '@/types';

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

export default function AddServiceForm() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('Smartphone');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState<string>('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [serviceMode, setServiceMode] = useState<ServiceMode>('Home Visit');
  const [serviceArea, setServiceArea] = useState(user?.area || '');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // File input handler uploading via ImgBB
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WEBP)');
      return;
    }

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
          toast.success('Service banner uploaded to ImgBB!');
        }
      } catch (err: any) {
        toast.error(err.message || 'Image upload failed');
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || title.length < 5) {
      toast.error('Title must be at least 5 characters');
      return;
    }

    if (!description.trim() || description.length < 20) {
      toast.error('Description must be at least 20 characters');
      return;
    }

    const priceNum = parseFloat(basePrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Base price must be a positive number');
      return;
    }

    if (!estimatedDuration.trim()) {
      toast.error('Please provide an estimated duration');
      return;
    }

    if (!serviceArea.trim()) {
      toast.error('Please provide your service coverage area');
      return;
    }

    if (!imageUrl) {
      toast.error('Please upload a service image file');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch<{ success: boolean; message: string }>('/services', {
        method: 'POST',
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
      });

      if (res.success) {
        toast.success('Service submitted! It is now waiting for admin approval.');
        router.push('/dashboard/technician/my-services');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to create service');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Technician Read-only Details */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span>Technician Name (Session)</span>
          </span>
          <span className="font-extrabold text-slate-800 text-sm">{user?.name}</span>
        </div>
        <div>
          <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>Technician Email (Session)</span>
          </span>
          <span className="font-extrabold text-slate-800 text-sm truncate block">{user?.email}</span>
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-slate-900 pb-4 border-b border-slate-100 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-blue-600" />
          <span>Service Listing Details</span>
        </h3>

        {/* Image Upload through ImgBB (File Input per PDF Requirement) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-blue-600" />
            <span>Service Banner Photo (ImgBB File Upload)</span>
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            {imageUrl ? (
              <div className="w-28 h-20 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 shadow-xs">
                <img src={imageUrl} alt="Uploaded banner" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-28 h-20 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                <Camera className="w-8 h-8" />
              </div>
            )}

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm">
                <Camera className="w-4 h-4" />
                <span>{uploadingImage ? 'Uploading via ImgBB...' : 'Choose Image File'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-slate-500">
                File input uploaded directly to ImgBB. High-resolution photos recommended.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Service Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. iPhone & Smartphone Screen Replacement"
              required
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-600" />
              <span>Category</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ServiceCategory)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Service Mode */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Service Mode
            </label>
            <select
              value={serviceMode}
              onChange={(e) => setServiceMode(e.target.value as ServiceMode)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
            >
              {SERVICE_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>

          {/* Base Price */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-blue-600" />
              <span>Base Price (USD)</span>
            </label>
            <input
              type="number"
              min="1"
              step="any"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              placeholder="45"
              required
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Estimated Duration */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Estimated Duration</span>
            </label>
            <input
              type="text"
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(e.target.value)}
              placeholder="e.g. 1-2 hours or 1 day"
              required
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Service Area */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Coverage Area</span>
            </label>
            <input
              type="text"
              value={serviceArea}
              onChange={(e) => setServiceArea(e.target.value)}
              placeholder="e.g. Dhanmondi, Dhaka"
              required
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Description (What the service includes - Min 20 chars)</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain repair diagnosis, standard replacement parts used, testing procedure, and warranty terms..."
              required
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={submitting || uploadingImage}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{submitting ? 'Submitting for Approval...' : 'Publish Service (Pending Approval)'}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
