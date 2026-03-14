---
name: google-vertex-compatibility
description: 'Create Google Cloud compatibility flows for ML projects. Use when users ask to make TensorFlow/Keras/PyTorch code work on Google, migrate to Vertex AI, adapt classes for cloud training/serving, or need step-by-step GCP integration guides.'
argument-hint: 'What should be adapted for Vertex AI? Include framework, current code, and target flow.'
user-invocable: true
---

# Google Vertex Compatibility

## Purpose
Convert existing ML code into Google Cloud compatible implementations with concrete file edits, migration steps, and runnable commands.

## Trigger Conditions
- User says "make it work with Google" or asks about Vertex AI
- User asks for GCP training, serving, or MLOps flows
- **You are about to write or adapt any ML code for Google Cloud**
- GCP ML Expert agent is invoked for cloud migration

## When to Use
- User says: make it work with Google.
- User asks for Vertex AI migration from local scripts.
- User needs training/deployment flows on GCP.
- User wants class-level adaptation for cloud-ready training or prediction.

## Inputs To Collect
1. Framework and stack.
- TensorFlow, Keras, or PyTorch.
- Python version, dependency manager, and container usage.

2. Current architecture.
- Existing training class/function and serving class/function.
- Data source and model artifact paths.

3. Target Google flow.
- Training only, serving only, or end-to-end MLOps.
- Online prediction, batch prediction, or both.

4. Operational constraints.
- Region, budget, latency, security, and compliance constraints.

## Procedure
1. Assess compatibility gaps.
- Identify local-only assumptions: filesystem paths, credentials, hardcoded env values, and unmanaged dependencies.
- Identify portability risks: GPU/CUDA mismatch, non-deterministic runs, and framework-version issues.

2. Create adaptation plan.
- Map local paths to GCS URIs.
- Define entrypoints for training and serving.
- Define required env vars and secrets strategy.
- Choose Vertex AI resources: machine type, accelerator, region, and artifact locations.

3. Adapt or create classes for Vertex AI.
- If code is class-based, create/adapt a dedicated integration class.
- Recommended wrappers:
  - VertexTrainerAdapter for training job configuration/submission.
  - VertexPredictorAdapter for model endpoint deployment/inference calls.
- Keep model logic separate from cloud orchestration logic.

4. Implement commands and configs.
- Provide exact gcloud or SDK commands.
- Provide dependency pins and container build/run instructions when needed.
- Ensure service account and IAM role coverage for GCS and Vertex AI operations.

5. Write a concise guide.
- Include architecture summary.
- Include migration steps and rollback strategy.
- Include validation checks and smoke tests.

6. Validate and harden.
- Verify data access to GCS.
- Verify artifact read/write paths.
- Verify endpoint deployment and inference behavior.
- Add monitoring and cost controls.

## Output Requirements
Always return:
1. Google Compatibility Flow section.
2. Class adaptation section showing what was changed or created.
3. Runnable command list.
4. Validation checklist.
5. Risks and rollback notes.

## Class Adaptation Pattern
When asked to make code work on Google, default to this structure:
1. Keep core model code untouched as much as possible.
2. Add an adapter class dedicated to Vertex AI orchestration.
3. Inject runtime settings via env vars/config object.
4. Use GCS for training data and artifact persistence.
5. Expose clear methods for train, deploy, and predict.

## Completion Criteria
- User can run training and/or prediction on Google Cloud with the provided steps.
- Required classes are created or adapted for Vertex AI compatibility.
- Security and IAM basics are explicitly covered.
- Validation steps are specific and executable.
