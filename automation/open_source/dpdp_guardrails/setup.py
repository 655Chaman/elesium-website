from setuptools import setup, find_packages

setup(
    name="dpdp-guardrails",
    version="0.1.0",
    author="Chaman Shah",
    author_email="chaman@elesium.online",
    description="High-throughput DPDP Act 2023 compliant PII masking and verification guardrails for enterprise AI agents.",
    long_description=open("README.md", encoding="utf-8").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/655Chaman/dpdp-guardrails",
    packages=find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: Apache Software License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.8",
)
