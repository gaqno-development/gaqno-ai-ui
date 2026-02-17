"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@gaqno-development/frontcore/components/ui";
import { useErpProducts } from "@gaqno-development/frontcore/hooks/ai";
import {
  AIProductProfileBuilder,
  AIContentGenerator,
  AIVideoGenerator,
  AIDistributionPublisher,
} from "@gaqno-development/frontcore/components/ai";
import type { ErpProduct } from "@gaqno-development/frontcore/utils/api";
import type { ProductProfileResponse } from "@gaqno-development/frontcore/utils/api";
import {
  ChevronLeft,
  ChevronRight,
  Package,
  FileText,
  Film,
  Send,
} from "lucide-react";

const STEPS = [
  { id: "product", label: "Select product", icon: Package },
  { id: "profile", label: "Build profile", icon: FileText },
  { id: "content", label: "Generate content", icon: Film },
  { id: "publish", label: "Review & publish", icon: Send },
];

export default function ContentStudioPage() {
  const [step, setStep] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<ErpProduct | null>(
    null
  );
  const [profileResult, setProfileResult] =
    useState<ProductProfileResponse | null>(null);
  const [generatedCopy, setGeneratedCopy] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);

  const productsQuery = useErpProducts({ limit: 50 });
  const products = productsQuery.data ?? [];

  const productForProfile = selectedProduct
    ? {
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        tenantId: selectedProduct.tenantId,
        description: selectedProduct.description,
        sku: selectedProduct.sku,
        stock: selectedProduct.stock,
        category: selectedProduct.category,
        imageUrls: selectedProduct.imageUrls,
      }
    : null;

  const canNext =
    (step === 0 && selectedProduct != null) ||
    (step === 1 && profileResult != null) ||
    step === 2 ||
    step === 3;
  const canPrev = step > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Content Studio</h2>
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <Button
              key={s.id}
              variant={step === i ? "default" : "ghost"}
              size="sm"
              onClick={() => setStep(i)}
              disabled={
                (i === 1 && !selectedProduct) ||
                (i === 2 && !profileResult) ||
                (i === 3 && !generatedCopy && !videoId)
              }
            >
              <s.icon className="h-4 w-4 mr-1" />
              {i + 1}
            </Button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Select product</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choose a product from ERP to generate profile and content.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 max-w-md">
                  <Label>Product</Label>
                  <Select
                    value={selectedProduct?.id ?? ""}
                    onValueChange={(id) => {
                      const p = products.find((x) => x.id === id) ?? null;
                      setSelectedProduct(p);
                    }}
                    disabled={productsQuery.isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          productsQuery.isLoading
                            ? "Loading…"
                            : "Select a product"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name} — {p.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 1 && selectedProduct && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
          >
            <AIProductProfileBuilder
              initialData={productForProfile}
              onProfileBuilt={setProfileResult}
              title="Build product profile"
            />
          </motion.div>
        )}

        {step === 2 && selectedProduct && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <AIContentGenerator
              productData={productForProfile}
              onContentGenerated={(data) => setGeneratedCopy(data.copy)}
              title="Generate marketing copy"
            />
            <AIVideoGenerator
              productName={selectedProduct.name}
              productDescription={selectedProduct.description}
              onVideoGenerated={(data) => setVideoId(data.id)}
              compact
              title="Generate video (optional)"
            />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Preview content</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Review and edit copy, then publish to channels.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Copy</Label>
                  <Textarea
                    value={generatedCopy}
                    onChange={(e) => setGeneratedCopy(e.target.value)}
                    className="min-h-[120px]"
                    placeholder="Generated copy or paste here"
                  />
                </div>
              </CardContent>
            </Card>
            <AIDistributionPublisher
              content={generatedCopy}
              title="Publish to WhatsApp"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={!canPrev}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button
          onClick={() => setStep((s) => Math.min(3, s + 1))}
          disabled={!canNext && step < 3}
        >
          {step === 3 ? "Done" : "Next"}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
