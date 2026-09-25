import { Input } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Loader2, MapPin } from "lucide-react";
import { forwardRef, useEffect, useRef, useState } from "react";
import { goongApi, type PlacePrediction, type ResolvedPlace } from "@/features/geo";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  /** Called with coordinates + admin units after a suggestion is picked */
  onSelectPlace: (place: ResolvedPlace) => void;
  placeholder?: string;
  disabled?: boolean;
}

/** Text input with Goong Place AutoComplete suggestions */
export const AddressAutocomplete = forwardRef<HTMLInputElement, AddressAutocompleteProps>(
  function AddressAutocomplete({ value, onChange, onBlur, onSelectPlace, placeholder, disabled }, ref) {
    const [query, setQuery] = useState<string | null>(null); // only set while the user is typing
    const [results, setResults] = useState<PlacePrediction[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const requestRef = useRef(0);

    useEffect(() => {
      const q = query?.trim() ?? "";
      if (q.length < 3) return;

      const controller = new AbortController();
      const timer = window.setTimeout(async () => {
        setLoading(true);
        try {
          setResults(await goongApi.autocomplete(q, controller.signal));
          setOpen(true);
        } catch {
          if (!controller.signal.aborted) setResults([]);
        } finally {
          if (!controller.signal.aborted) setLoading(false);
        }
      }, 400);

      return () => {
        window.clearTimeout(timer);
        controller.abort();
      };
    }, [query]);

    const select = async (prediction: PlacePrediction) => {
      const requestId = ++requestRef.current;
      setOpen(false);
      setQuery(null);
      onChange(prediction.description);
      setLoading(true);
      try {
        const place = await goongApi.placeDetail(prediction.place_id, prediction.description);
        if (place && requestId === requestRef.current) onSelectPlace(place);
      } catch {
        // keep the typed address; coordinates stay unchanged
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="relative">
        <Input
          ref={ref}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
          onChange={(e) => {
            onChange(e.target.value);
            setQuery(e.target.value);
            if (e.target.value.trim().length < 3) setResults([]);
          }}
          onFocus={() => results.length > 0 && setOpen(true)}
          onBlur={() => {
            setOpen(false);
            onBlur?.();
          }}
          className="pr-16"
        />
        {loading && <Loader2 className="pointer-events-none absolute right-9 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />}
        {open && results.length > 0 && (
          <ul className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-slate-200 bg-white p-1 shadow-lg">
            {results.map((r) => (
              <li key={r.place_id}>
                <button
                  type="button"
                  className="flex w-full items-start gap-2 rounded px-3 py-2 text-left text-sm hover:bg-slate-100"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    void select(r);
                  }}
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{r.description}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  },
);
