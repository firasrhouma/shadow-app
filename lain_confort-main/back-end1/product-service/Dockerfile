# ---------- BUILD STAGE ----------
FROM maven:3.9.6-amazoncorretto-17 AS build

WORKDIR /app

# Copy pom.xml first to cache dependencies
COPY pom.xml .
COPY src ./src

# Build the JAR
RUN mvn clean package -DskipTests

# ---------- RUNTIME STAGE ----------
FROM amazoncorretto:17-alpine-jdk

WORKDIR /app

# Copy only the built JAR
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8081

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
