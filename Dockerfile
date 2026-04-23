
# Frontend

FROM guergeiro/pnpm:22-10 as Frontend


WORKDIR /app
COPY ./Frontend /app/


RUN pnpm install
RUN pnpm build



# Backend
FROM guergeiro/pnpm:22-10




WORKDIR /app

# Copy dependency files
COPY Backend/package.json Backend/pnpm-lock.yaml ./

COPY --from=Frontend /app/dist /app/public


# Install dependencies
RUN pnpm install

# Copy rest of the code
COPY Backend .

# Expose port
EXPOSE 3000

# Start app
CMD ["pnpm", "run", "start"]