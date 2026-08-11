import React from 'react';
import { useStore } from '@nanostores/react';
import { language } from '../store';
import type { TourComparison } from '../data/tour-seo-overrides';

interface TourComparisonTableProps {
    comparison: TourComparison;
}

export default function TourComparisonTable({ comparison }: TourComparisonTableProps) {
    const $language = useStore(language);
    const c = comparison.columns;
    const heading = comparison.heading[$language] || comparison.heading.en;

    return (
        <div>
            <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3 italic uppercase tracking-tight">
                <span className="w-8 h-1 bg-gradient-to-r from-primary to-brand-orange rounded-full"></span>
                {heading}
            </h2>

            <div className="overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full text-left text-sm border-collapse min-w-[560px]">
                    <thead>
                        <tr className="bg-white/5">
                            <th className="px-5 py-4 text-white font-bold">
                                {c.feature[$language] || c.feature.en}
                            </th>
                            <th className="px-5 py-4 text-brand-teal font-bold">
                                {c.vamos[$language] || c.vamos.en}
                            </th>
                            <th className="px-5 py-4 text-gray-400 font-bold">
                                {c.others[$language] || c.others.en}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {comparison.rows.map((row, i) => (
                            <tr
                                key={i}
                                className={`border-t border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
                            >
                                <td className="px-5 py-4 text-gray-200 font-medium">
                                    {row.feature[$language] || row.feature.en}
                                </td>
                                <td className="px-5 py-4 text-emerald-300">
                                    {row.vamos[$language] || row.vamos.en}
                                </td>
                                <td className="px-5 py-4 text-gray-400">
                                    {row.others[$language] || row.others.en}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
