'use client';

import { useState } from 'react';
import { VideoPackage, Scene, VideoAsset, TrendingTopic } from '@/types';

export function useGenerator() {
  const [topic, setTopic] = useState<TrendingTopic | null>(null);
  const [hooks, setHooks] = useState<string[]>([]);
  const [selectedHook, setSelectedHook] = useState<string>('');
  const [pkg, setPkg] = useState<VideoPackage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchHooks = async (topicTitle: string) => {
    setIsGenerating(true);
    const res = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ type: 'hooks', topic: topicTitle })
    });
    const data = await res.json();
    setHooks(data);
    setIsGenerating(false);
  };

  const generateFullPackage = async (hook: string) => {
    if (!topic) return;
    setIsGenerating(true);
    // 1. Generate Script
    const scriptRes = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ type: 'script', topic: topic.title, hook })
    });
    const scriptData = await scriptRes.json();

    // 2. Generate Metadata
    const metaRes = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ type: 'metadata', topic: topic.title })
    });
    const metaData = await metaRes.json();

    const videoPkg: VideoPackage = {
      topic: topic.title,
      hook,
      script: scriptData.scenes,
      titles: metaData.titles,
      description: metaData.description,
      hashtags: metaData.hashtags
    };

    setPkg(videoPkg);
    setIsGenerating(false);

    // Auto-fetch assets for all scenes
    scriptData.scenes.forEach((scene: any, i: number) => {
      findAssetsForScene(i, scene.text, videoPkg);
    });

    return videoPkg;
  };

  const findAssetsForScene = async (sceneIndex: number, sceneText: string, currentPkg?: VideoPackage) => {
    // a. Extract keywords
    const kwRes = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ type: 'keywords', sceneText })
    });
    const keywords = await kwRes.json();

    // b. Fetch assets
    const assetRes = await fetch('/api/assets', {
      method: 'POST',
      body: JSON.stringify({ keywords })
    });
    const assets = await assetRes.json();

    setPkg(prev => {
      if (!prev) return prev;
      const newScript = [...prev.script];
      newScript[sceneIndex] = {
        ...newScript[sceneIndex],
        assets: assets,
        keywords: keywords
      };
      return { ...prev, script: newScript };
    });
  };

  return {
    topic, setTopic,
    hooks, fetchHooks,
    selectedHook, setSelectedHook,
    pkg, setPkg,
    isGenerating,
    generateFullPackage,
    findAssetsForScene
  };
}
